import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import {
  demoAuthSecret,
  hasSupabaseConfig,
  isDemoDataMode,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/env";
import type { Role, User } from "@/types";
import { getDataStore } from "@/services/data";

// ── Demo-mode signed session cookie ──────────────────────────────────────────
// Only used when Supabase is not configured. The cookie carries a compact
// HMAC-signed payload (uid/email/name/role/exp) so page and API code can
// trust it server-side. This is a development convenience, production
// authentication always runs through Supabase Auth.

const COOKIE_NAME = "ew_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

interface DemoSessionPayload {
  uid: string;
  email: string;
  name: string;
  role: Role;
  exp: number;
}

function signPayload(payload: DemoSessionPayload): string {
  const secret = demoAuthSecret();
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyPayload(token: string): DemoSessionPayload | null {
  const secret = demoAuthSecret();
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as DemoSessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createDemoSession(user: User): Promise<void> {
  const cookieStore = await cookies();
  const payload: DemoSessionPayload = {
    uid: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  cookieStore.set(COOKIE_NAME, signPayload(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function destroyDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

// ── Supabase server client (cookie-based session) ────────────────────────────

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl()!, supabaseAnonKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          cookieStore.set(cookie);
        }
      },
    },
  });
}

// ── Current user (both modes) ────────────────────────────────────────────────

export interface SessionUser extends User {}

/**
 * Resolves the current user server-side, or null when signed out.
 *  - Demo mode: reads the signed ew_session cookie, then the user record.
 *  - Supabase: reads the Supabase session and maps to the users row.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (isDemoDataMode()) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = verifyPayload(token);
    if (!payload) return null;
    const user = await getDataStore().getUserById(payload.uid);
    return user ? { ...user, role: payload.role } : null;
  }

  const supabase = await supabaseServer();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;
  const record = await getDataStore().getUserById(authUser.id);
  return record ?? null;
}

/** Like getCurrentUser but redirects to /login when signed out. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Redirects with a message when the user lacks a required role. */
export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }
  return user;
}

export { hasSupabaseConfig };
