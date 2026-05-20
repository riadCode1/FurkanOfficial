/**
 * Quran Foundation OAuth2 Configuration
 *
 * SETUP:
 *   1. Get client_id from https://api-docs.quran.foundation/request-access/
 *   2. Register your redirect URI in the QF dashboard
 *   3. Deploy the backend (/backend/server.js) and set BACKEND_BASE_URL
 *   4. Flip USE_PRELIVE to false when going to production
 */

// ─── Environment toggle ──────────────────────────────────────────────────────
export const USE_PRELIVE = false; // set to false for production

// ─── Your app credentials (public — safe in mobile bundle) ───────────────────
export const CLIENT_ID = "a9001320-ae9f-4138-96e6-9817f298670b"; // from QF Request Access
export const CLIENT_SECRET = "auTUwu.LX92KOjK~tC0oDp3F20"; // from QF Request Access (only used on backend, never in mobile code)
// ─── Your backend URL (performs token exchange & refresh) ────────────────────
// CLIENT_SECRET must NEVER appear in the mobile bundle.
// It lives only on this backend.
export const BACKEND_BASE_URL = "https://node-1-41dg.onrender.com"; // e.g. https://myapp-backend.fly.dev

// ─── Redirect URI ─────────────────────────────────────────────────────────────
// For Expo Go (dev):       exp://192.168.x.x:8081
// For EAS custom scheme:   com.yourapp://oauth/callback
// Register EXACTLY this string in the QF dashboard.
export const REDIRECT_URI ="furkan://oauth/callback"; // e.g. com.yourapp://oauth/callback

// ─── OAuth2 / OIDC discovery endpoints ───────────────────────────────────────
const authBaseUrl = false
  ? "https://prelive-oauth2.quran.foundation"
  : "https://oauth2.quran.foundation";

export const DISCOVERY = {
  authorizationEndpoint: `${authBaseUrl}/oauth2/auth`,
  tokenEndpoint: `${authBaseUrl}/oauth2/token`,
  revocationEndpoint: `${authBaseUrl}/oauth2/revoke`,
};

// ─── API base URL ─────────────────────────────────────────────────────────────
export const API_BASE_URL = USE_PRELIVE
  ? "https://apis-prelive.quran.foundation"
  : "https://apis.quran.foundation";

// ─── OAuth2 scopes ────────────────────────────────────────────────────────────
// Request ONLY what your app needs.
// offline_access → enables refresh tokens
// openid         → provides id_token with user identity (sub, email, name)
export const SCOPES = [
  
  "offline_access",
  
  
  "users"
  
  
];