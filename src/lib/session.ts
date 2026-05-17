import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  isAdmin: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "dev-session-secret-min-32-chars-long!!",
  cookieName: "impram_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
