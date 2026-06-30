import { cookies } from "next/headers";
import { verifyToken, type AdminJWTPayload } from "./jwt";

/**
 * Reads the auth_token cookie and verifies the JWT.
 * Returns the decoded payload or null if unauthenticated / token invalid.
 */
export async function getAdminFromRequest(): Promise<AdminJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Throws an error with the sentinel string "UNAUTHORIZED" when not authenticated.
 * Use inside route handlers that need to verify auth themselves (beyond middleware).
 */
export async function requireAuth(): Promise<AdminJWTPayload> {
  const admin = await getAdminFromRequest();
  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }
  return admin;
}
