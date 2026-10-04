import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";

function secretKey() {
  const value = process.env.SESSION_SECRET || "yusho-dev-insecure-secret-change-me";
  return new TextEncoder().encode(value);
}

export type SessionData = {
  sub: string;
  role: string;
  name: string;
  email: string;
};

/** Public user shape — never includes passwordHash or resetToken. */
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  profileImage: string | null;
  bio: string | null;
  createdAt: Date;
};

export function isAdmin(u: SafeUser | null | undefined) {
  return u?.role === "ADMIN";
}

export async function signSession(payload: SessionData): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      role: String(payload.role ?? "USER"),
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    return null;
  }
}

/** Session identity from the cookie (stateless — no DB hit). */
export async function getSessionUser(): Promise<SessionData | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Full user from the database (fresh role/data). */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = await getSessionUser();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) return null;
  return toSafeUser(user);
}

export function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  profileImage: string | null;
  bio: string | null;
  createdAt: Date;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}

/** Set the session cookie. */
export async function createSession(user: {
  id: string;
  role: string;
  name: string;
  email: string;
}) {
  const token = await signSession({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// ── Passwords ────────────────────────────────────────────────────────────────
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/** Helper for actions that require a signed-in user. */
export async function authGuard() {
  const user = await getCurrentUser();
  if (!user) return { user: null as null, error: "Please sign in to continue." };
  return { user, error: null as null };
}

/** Helper for actions that require an admin. */
export async function adminGuard() {
  const user = await getCurrentUser();
  if (!user) return { user: null as null, error: "Please sign in to continue." };
  if (user.role !== "ADMIN") return { user: null as null, error: "You don't have permission to do that." };
  return { user, error: null as null };
}