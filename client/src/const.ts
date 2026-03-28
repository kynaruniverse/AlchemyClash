// ============================================================
// ALCHEMY CLASH — Client Constants & Helpers
// ============================================================

/**
 * Cookie name used to store the user's session.
 */
export const COOKIE_NAME = "alchemy_session";

/**
 * Duration of one year in milliseconds.
 * Used for setting cookie expiry.
 */
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

/**
 * Generates the login URL for the OAuth portal.
 * The URL includes the app ID, redirect URI, and a base64‑encoded state containing the redirect URI.
 *
 * @returns The fully constructed login URL as a string.
 */
export const getLoginUrl = (): string => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  if (!oauthPortalUrl || !appId) {
    console.warn("Missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID in environment.");
    return "/";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri); // Base64 encoding is safe for this purpose.

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};