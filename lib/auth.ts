// Auth configuration and types

// Cookie configuration
export const AUTH_COOKIE_NAME = "auth_token";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Type for the session user
export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface Session {
  token: string;
  user: SessionUser;
}

// Encode session data to base64
export function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

// Decode session data from base64
export function decodeSession(encoded: string): Session | null {
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(decoded) as Session;
  } catch {
    return null;
  }
}
