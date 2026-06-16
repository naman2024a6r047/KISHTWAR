import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

// ─────────────────────────────────────────────
// Password Hashing
// ─────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword);
}

// ─────────────────────────────────────────────
// JWT Token Generation & Verification
// ─────────────────────────────────────────────

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  username: string;
}

export async function generateAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function generateRefreshToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Token Generation Helpers
// ─────────────────────────────────────────────

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─────────────────────────────────────────────
// Session Management
// ─────────────────────────────────────────────

export async function createSession(
  userId: number,
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
) {
  // Calculate expiry from REFRESH_TOKEN_EXPIRY string
  const daysMatch = REFRESH_TOKEN_EXPIRY.match(/(\d+)d/);
  const days = daysMatch ? parseInt(daysMatch[1]) : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    },
  });
}

export async function deleteSession(refreshToken: string) {
  return prisma.session.deleteMany({
    where: { refreshToken },
  });
}

export async function deleteAllUserSessions(userId: number) {
  return prisma.session.deleteMany({
    where: { userId },
  });
}

// ─────────────────────────────────────────────
// Cookie Management
// ─────────────────────────────────────────────

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}

// ─────────────────────────────────────────────
// Auth Verification (Server-side)
// ─────────────────────────────────────────────

export async function getCurrentUser() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const payload = await verifyToken(accessToken);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      avatar: true,
      role: true,
      emailVerified: true,
      phone: true,
      bio: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireRole(roles: string[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}
