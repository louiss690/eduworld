import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isDemoDataMode } from "@/lib/env";
import { getDataStore } from "@/services/data";
import { createDemoSession, supabaseServer } from "@/services/auth/session";
import { registerSchema } from "@/services/auth/schemas";

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

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const store = getDataStore();

  // ── Demo mode ──────────────────────────────────────────────────────────
  if (isDemoDataMode()) {
    const existing = await store.getUserByEmail(input.email);
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    const user = await store.createUser({
      email: input.email,
      name: input.name,
      role: "student",
      passwordHash: hashPassword(input.password),
    });
    await store.setStudentProfile(user.id, {
      countryCode: input.countryCode ?? null,
      languageCode: input.languageCode ?? "en",
      educationLevelId: input.educationLevelId ?? null,
    });
    await store.addNotification({
      userId: user.id,
      type: "enrollment",
      title: "Welcome to EduWorld 🎓",
      body: "Your learning journey starts here. Explore courses or meet your AI tutor.",
    });
    await createDemoSession(user);
    return NextResponse.json({ ok: true, user });
  }

  // ── Supabase mode ──────────────────────────────────────────────────────
  const supabase = await supabaseServer();
  const origin = new URL(request.url).origin;
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name },
      emailRedirectTo: `${origin}/verify`,
    },
  });

  if (error) {
    const isTaken = error.message.toLowerCase().includes("already registered");
    return NextResponse.json(
      { ok: false, error: isTaken ? "An account with this email already exists." : error.message },
      { status: isTaken ? 409 : 400 }
    );
  }

  const authUser = data.user;
  if (!authUser) {
    return NextResponse.json(
      { ok: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }

  await store.createUser({
    email: input.email,
    name: input.name,
    role: "student",
    passwordHash: null,
  }).catch(() => {
    // The auth user may already have a profile row (e.g. on resubmit).
  });
  await store.setStudentProfile(authUser.id, {
    countryCode: input.countryCode ?? null,
    languageCode: input.languageCode ?? "en",
    educationLevelId: input.educationLevelId ?? null,
  }).catch(() => {});

  if (data.session) {
    // Email confirmation is disabled: session is already established.
    const user = await store.getUserById(authUser.id);
    return NextResponse.json({ ok: true, user });
  }

  return NextResponse.json({
    ok: true,
    needsVerification: true,
    // Only mention the demo caveat when the app is genuinely running without
    // Supabase; with Supabase connected, a real verification email is sent.
    demoNotice: isDemoDataMode()
      ? "An email verification link was sent. In the demo environment no email is actually delivered."
      : undefined,
  });
}
