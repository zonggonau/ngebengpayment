import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // During build time, Next.js sets NODE_ENV=production but env vars may not be available.
    // We only throw at runtime in production, not during build.
    const isBuildTime =
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.PHASE === "build";
    if (process.env.NODE_ENV === "production" && !isBuildTime) {
      throw new Error(
        "JWT_SECRET environment variable is required in production"
      );
    }
    console.warn(
      "WARNING: JWT_SECRET not set. Using insecure fallback for development only."
    );
    return "ngebeng-payment-dev-secret-do-not-use-in-production";
  }
  return secret;
})();
const SALT_ROUNDS = 10;

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

// ========== PASSWORD HASHING ==========

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ========== JWT TOKEN ==========

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ========== AUTH HELPERS ==========

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  const cookie = request.cookies.get("token");
  if (cookie?.value) {
    return cookie.value;
  }

  return null;
}

export function getAuthUser(request: NextRequest): JwtPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
