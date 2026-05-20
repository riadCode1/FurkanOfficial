/**
 * Quran Foundation Content API – backend token manager (Node.js / CommonJS)
 *
 * Reads QF_CLIENT_ID, QF_CLIENT_SECRET, and QF_ENV from the environment.
 * Never require() this file in browser or mobile bundles – it holds client_secret.
 *
 * Requires Node 18+ (global fetch). No external dependencies.
 *
 * Docs:
 *   https://api-docs.quran.foundation/docs/quickstart/manual-authentication
 *   https://api-docs.quran.foundation/docs/quickstart/token-management
 */

"use strict";

// ---------------------------------------------------------------------------
// Environment & URL resolution
// ---------------------------------------------------------------------------

const AUTH_BASE = {
  prelive:    "https://prelive-oauth2.quran.foundation",
  production: "https://oauth2.quran.foundation",
};

const API_BASE = {
  prelive:    "https://apis-prelive.quran.foundation",
  production: "https://apis.quran.foundation",
};

function resolveEnv() {
  const raw = process.env.QF_ENV ?? "prelive";
  if (!(raw in AUTH_BASE)) {
    throw new Error(
      `Invalid QF_ENV value: "${raw}". Expected "prelive" or "production".`
    );
  }
  return raw;
}

function requireVar(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const qfEnv       = resolveEnv();
const authBaseUrl = AUTH_BASE[qfEnv];
const apiBaseUrl  = API_BASE[qfEnv];

// ---------------------------------------------------------------------------
// Token cache state (module-scoped → shared across all callers in the process)
// ---------------------------------------------------------------------------

const EARLY_EXPIRY_MS = 30 * 1000; // re-request 30 s before expiry

let cachedToken      = null;
let expiresAt        = 0;     // Unix ms
let inflightRequest  = null;  // shared Promise – stampede prevention

// ---------------------------------------------------------------------------
// Core fetch (private – use getAccessToken instead)
// ---------------------------------------------------------------------------

async function fetchFreshToken() {
  const clientId     = process.env.EXPO_PUBLIC_CLIENT_ID || requireVar("QF_CLIENT_ID");
  const clientSecret = process.env.EXPO_PUBLIC_CLIENT_SECRET || requireVar("QF_CLIENT_SECRET");

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:  `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope:      "content",
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`QF token request failed: HTTP ${response.status} – ${body}`);
  }

  const data  = await response.json();
  cachedToken = data.access_token;
  expiresAt   = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns a valid access token, using the in-memory cache when possible.
 * Only one network request is in flight at a time (stampede prevention).
 *
 * @returns {Promise<string>}
 */
async function getAccessToken() {
  // Fast path – token is still fresh.
  if (cachedToken && Date.now() < expiresAt - EARLY_EXPIRY_MS) {
    return cachedToken;
  }

  // Slow path – deduplicate concurrent callers behind one shared Promise.
  if (!inflightRequest) {
    inflightRequest = fetchFreshToken().finally(() => {
      inflightRequest = null;
    });
  }
console.log("Fetching new token, inflightRequest:", !!inflightRequest);
  return inflightRequest;
}

/**
 * Invalidates the cached token.
 * Call this when a Content API response returns 401, then retry once.
 */
function clearToken() {
  cachedToken = null;
  expiresAt   = 0;
}

/**
 * Returns { access_token, expires_in }.
 * Safe to forward to your own frontend – client_secret is never included.
 *
 * @returns {Promise<{ access_token: string, expires_in: number }>}
 */
async function getTokenResponse() {
  const access_token = await getAccessToken();
  const expires_in   = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  return { access_token, expires_in };
}

/**
 * Authenticated GET against the Content API with automatic 401 retry (once).
 * Returns the raw fetch Response so callers can call .json(), .text(), etc.
 *
 * @param {string}       path   e.g. "/content/api/v4/chapters"
 * @param {RequestInit}  [init] additional fetch options (merged with auth headers)
 * @returns {Promise<Response>}
 */
async function contentApiFetch(path, init = {}) {
  const clientId = requireVar("QF_CLIENT_ID");

  async function doRequest() {
    const token = await getAccessToken();
    return fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        "x-auth-token": token,
        "x-client-id":  clientId,
      },
    });
  }

  let response = await doRequest();

  if (response.status === 401) {
    clearToken();
    response = await doRequest();
  }

  return response;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  authBaseUrl,
  apiBaseUrl,
  getAccessToken,
  clearToken,
  getTokenResponse,
  contentApiFetch,
};