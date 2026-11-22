import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";

const secret = process.env.JWT_SECRET;

function getSecret() {
  if (!secret) {
    throw new Error("JWT_SECRET is missing from .env.local");
  }
  return secret;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
  userMail: string;
  role: string;
}

// Create a token after successful login.
export function createToken(userId: string, userMail: string, role: string) {
  return jwt.sign({ userId, userMail, role }, getSecret(), {
    expiresIn: "7d",
  });
}

// Verify a token and return its payload.
export function verifyToken(token: string): TokenPayload | null {
  try {
    const result = jwt.verify(token, getSecret());

    if (typeof result === "string" || !result.userId) {
      return null;
    }

    return result as TokenPayload;
  } catch {
    return null;
  }
}

// Read the Bearer token from the incoming API request.
export function getUserId(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  const payload = verifyToken(token);
  return payload?.userId ?? null;
}

// Check whether a valid token belongs to an admin.
export function isAdmin(token: string) {
  const payload = verifyToken(token);
  return payload?.role === "admin";
}
