useAuth.tsx/**
 * useAuth — Core OAuth2 hook for Quran Foundation
 *
 * Responsibilities:
 *  - Generate PKCE code_verifier + code_challenge in the app
 *  - Open QF hosted login page via expo-auth-session
 *  - Send code + code_verifier → backend for token exchange (keeps CLIENT_SECRET off device)
 *  - Persist tokens in expo-secure-store
 *  - Refresh access_token transparently before expiry
 *  - Expose session to the rest of the app via React context
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from "jwt-decode";
import {
  BACKEND_BASE_URL,
  CLIENT_ID,
  DISCOVERY,
  REDIRECT_URI,
  SCOPES,
} from "../config";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  sub: string;        // permanent unique user identifier
  email?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  picture?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;  // Unix timestamp (ms)
  userProfile: UserProfile;
}

interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  /** Low-level: get a valid access token, refreshing if needed */
  getAccessToken: () => Promise<string>;
}

// ─── Secure storage keys ──────────────────────────────────────────────────────

const STORE_KEY = "qf_auth_session";

async function loadSession(): Promise<AuthSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function saveSession(session: AuthSession | null): Promise<void> {
  if (session) {
    await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(STORE_KEY);
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // expo-auth-session handles PKCE generation, state, and the browser redirect
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      redirectUri: REDIRECT_URI,
      usePKCE: true,   // expo-auth-session generates code_verifier + code_challenge
    },
    DISCOVERY
  );

  // ── Restore session from secure storage on mount ──────────────────────────
  useEffect(() => {
    (async () => {
      const stored = await loadSession();
      if (stored) {
        // If the stored token is still valid (>5 min buffer), use it
        if (stored.expiresAt - Date.now() > 5 * 60 * 1000) {
          setSession(stored);
        } else if (stored.refreshToken) {
          // Token expired — try to refresh via backend
          try {
            const refreshed = await refreshOnBackend(stored.refreshToken);
            await saveSession(refreshed);
            setSession(refreshed);
          } catch {
            await saveSession(null);
          }
        }
      }
      setIsLoading(false);
    })();
  }, []);

  // ── Handle the authorization response after the hosted login redirect ──────
  useEffect(() => {
    if (!response) return;

    (async () => {
      if (response.type === "error") {
        setError(response.error?.message ?? "Authorization error");
        return;
      }

      if (response.type !== "success") return;

      // PKCE: send code + code_verifier to the backend.
      // The backend uses CLIENT_SECRET to exchange them for tokens.
      if (!request?.codeVerifier) {
        setError("PKCE code_verifier missing — cannot exchange code safely.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const newSession = await exchangeOnBackend({
          code: response.params.code,
          codeVerifier: request.codeVerifier,
          redirectUri: REDIRECT_URI,
        });
        await saveSession(newSession);
        setSession(newSession);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [response, request?.codeVerifier]);

  // ── Token refresh helper ───────────────────────────────────────────────────
  const getAccessToken = useCallback(async (): Promise<string> => {
    if (!session) throw new Error("Not authenticated");

    // Return current token if still valid (>2 min buffer)
    if (session.expiresAt - Date.now() > 2 * 60 * 1000) {
      return session.accessToken;
    }

    if (!session.refreshToken) throw new Error("No refresh token available");

    const refreshed = await refreshOnBackend(session.refreshToken);
    await saveSession(refreshed);
    setSession(refreshed);
    return refreshed.accessToken;
  }, [session]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (session?.refreshToken) {
      // Revoke the refresh token on the backend (also clears the server session)
      await fetch(`${BACKEND_BASE_URL}/api/auth/qf/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      }).catch(() => {/* best-effort */});
    }
    await saveSession(null);
    setSession(null);
    setError(null);
  }, [session]);

  const login = useCallback(() => {
    setError(null);
    promptAsync();
  }, [promptAsync]);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, error, login, logout, getAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ─── Backend helpers ──────────────────────────────────────────────────────────

/**
 * Exchange authorization code for tokens on the backend.
 * The backend adds CLIENT_SECRET — it must never appear in the mobile bundle.
 */
async function exchangeOnBackend(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<AuthSession> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/auth/qf/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error ?? `Exchange failed (HTTP ${res.status})`);
  }

  const userProfile: UserProfile =
    payload.user ?? jwtDecode<UserProfile>(payload.idToken);

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    idToken: payload.idToken,
    expiresAt: Date.now() + payload.expiresIn * 1000,
    userProfile,
  };
}

/**
 * Refresh tokens on the backend (keeps CLIENT_SECRET off device).
 */
async function refreshOnBackend(refreshToken: string): Promise<AuthSession> {
  const res = await fetch(`${BACKEND_BASE_URL}/api/auth/qf/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = await res.json();
  if (!res.ok) {
    throw new Error(payload.error ?? `Refresh failed (HTTP ${res.status})`);
  }

  const userProfile: UserProfile =
    payload.user ?? (payload.idToken ? jwtDecode<UserProfile>(payload.idToken) : { sub: "" });

  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken ?? refreshToken,
    idToken: payload.idToken,
    expiresAt: Date.now() + payload.expiresIn * 1000,
    userProfile,
  };
}