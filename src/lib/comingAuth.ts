// lib/comingAuth.ts

/* The sign-in behind /coming.

   This is a static SPA: there is no server between the browser and the page, so
   this check runs in the visitor's own tab and anyone determined enough can step
   over it in devtools. It is a lock on the door of a public building — it stops
   the url being passed around and read by accident, and nothing more. The real
   gate would be Supabase Auth plus an RLS select policy limited to an
   authenticated role; see README.

   The password therefore lives in the env as a SHA-256 digest, never in the
   clear: the digest ships in the bundle either way, and a digest cannot be read
   back out and tried against anything else the owner uses. */

const USERNAME = import.meta.env.VITE_COMING_USERNAME;
const PASSWORD_SHA256 = import.meta.env.VITE_COMING_PASSWORD_SHA256;

/** False when either env var is missing, i.e. a deploy that forgot its keys. */
export const isComingAuthConfigured = Boolean(USERNAME && PASSWORD_SHA256);

const SESSION_KEY = "coming:session";

/** How long one sign-in lasts before the form comes back. */
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Compares without leaking which character differed through timing. The threat
 * is theoretical for a digest the attacker already has, but the primitive costs
 * two lines and using `===` here is the kind of thing that gets copied onward.
 */
const equalsInConstantTime = (left: string, right: string) => {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);

  return difference === 0;
};

// Storage access is wrapped — Safari private mode throws on localStorage.
const readStoredExpiry = () => {
  try {
    return Number(localStorage.getItem(SESSION_KEY)) || 0;
  } catch {
    return 0;
  }
};

/**
 * `localStorage` rather than `sessionStorage`, so a phone that drops the tab in
 * the background does not ask for the password again an hour later. The stamp
 * is the expiry, so a stale entry expires on its own instead of living forever.
 */
const writeSession = () => {
  try {
    localStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_MAX_AGE_MS));
  } catch {
    // Non-fatal: the sign-in just does not survive a reload.
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear if storage was never writable.
  }
};

/** True while an unexpired sign-in from this browser is still good. */
export const hasValidSession = () => {
  const expiresAt = readStoredExpiry();

  if (!expiresAt) return false;

  if (Date.now() >= expiresAt) {
    clearSession();
    return false;
  }

  return true;
};

/**
 * Checks one attempt and, on a match, opens the session.
 *
 * `unconfigured` is kept apart from `rejected` so a deploy missing its env vars
 * says so instead of quietly telling the owner their own password is wrong.
 */
export const signIn = async (username: string, password: string): Promise<"ok" | "rejected" | "unconfigured"> => {
  if (!isComingAuthConfigured) return "unconfigured";

  const passwordHash = await sha256Hex(password);

  // Both halves are always compared, so a wrong username costs the same as a wrong password.
  const usernameMatches = equalsInConstantTime(username.trim().toLowerCase(), USERNAME.trim().toLowerCase());
  const passwordMatches = equalsInConstantTime(passwordHash, PASSWORD_SHA256.trim().toLowerCase());

  if (!usernameMatches || !passwordMatches) return "rejected";

  writeSession();
  return "ok";
};
