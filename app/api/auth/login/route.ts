import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isDemoDataMode } from "@/lib/env";
import { getDataStore } from "@/services/data";
import { createDemoSession, supabaseServer } from "@/services/auth/session";
import { loginSchema } from "@/services/auth/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 15 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;
  const store = getDataStore();

  // ── Demo mode ──────────────────────────────────────────────────────────
  if (isDemoDataMode()) {
    const user = await store.verifyCredentials?.(email, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Incorrect email or password." },
        { status: 401 }
      );
    }
    await createDemoSession(user);
    return NextResponse.json({ ok: true, user });
  }

  // ── Supabase mode ──────────────────────────────────────────────────────
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const needsVerification = error.message.toLowerCase().includes("email not confirmed");
    return NextResponse.json(
      {
        ok: false,
        error: needsVerification
          ? "Please verify your email address before signing in."
          : "Incorrect email or password.",
        code: needsVerification ? "email_not_confirmed" : "invalid_credentials",
      },
      { status: 401 }
    );
  }

  let user = await store.getUserById(data.user.id);
  if (!user) {
    // Profile row missing (e.g. account created before EduWorld wiring): seed it.
    await store.createUser({
      email: data.user.email ?? email,
      name: (data.user.user_metadata?.name as string) ?? email.split("@")[0] ?? "Student",
      role: "student",
      passwordHash: null,
    }).catch(() => {});
    user = await store.getUserById(data.user.id);
  }
  return NextResponse.json({ ok: true, user });
}
