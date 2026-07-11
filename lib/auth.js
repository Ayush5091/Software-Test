import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "fitbook_token";
const TOKEN_TTL = "7d";

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

// Reads the current request's JWT cookie and returns the decoded payload
// ({ id, role, name, email }) or null when unauthenticated.
export function getSessionUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Throws a Response-friendly error object for API routes that require auth.
export function requireRole(user, roles) {
  if (!user) return { ok: false, status: 401, message: "Not authenticated" };
  if (roles && !roles.includes(user.role)) {
    return { ok: false, status: 403, message: "Not authorized for this action" };
  }
  return { ok: true };
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
