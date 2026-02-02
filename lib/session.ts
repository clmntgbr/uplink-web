import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, decodeSession, type Session } from "./auth";

/**
 * Get the current session from the auth cookie (server-side)
 * Use this in Server Components, Server Actions, and Route Handlers
 */
export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie?.value) {
      return null;
    }

    return decodeSession(authCookie.value);
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Check if the user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Get the auth token from the session (server-side)
 * Useful for making authenticated API calls to your backend
 */
export async function getAuthToken(): Promise<string | null> {
  const session = await getSession();
  return session?.token ?? null;
}
