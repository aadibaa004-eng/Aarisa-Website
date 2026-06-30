import { SignJWT, jwtVerify, type JWTPayload } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return new TextEncoder().encode(secret);
}

export interface AdminJWTPayload extends JWTPayload {
  adminId: string;
  email: string;
}

export async function signToken(payload: {
  adminId: string;
  email: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AdminJWTPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as AdminJWTPayload;
}
