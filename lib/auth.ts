// lib/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function signToken(payload: Record<string, any>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
}

export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const p = jwt.verify(token, JWT_SECRET);
    return p as any;
  } catch (e) {
    return null;
  }
}
