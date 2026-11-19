import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isDemoDataMode } from "@/lib/env";
import { getDataStore } from "@/services/data";
import { supabaseServer } from "@/services/auth/session";
import { resetSchema } from "@/services/auth/schemas";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 5 });
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
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const { email, newPassword } = parsed.data;

  // ── Demo mode: reset the local account password directly. ───────────────
  if (isDemoDataMode()) {
    const store = getDataStore();
    const user = await store.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "No account found with that email." },
        { status: 404 }
      );
    }
    const { getLocalStore } = await import("@/services/data/localStore");
    await (
      getLocalStore() as unknown as { setPassword: (email: string, hash: string) => Promise<void> }
    ).setPassword(email, hashPassword(newPassword));
    return NextResponse.json({ ok: true });
  }

  // ── Supabase mode: exchange recovery code for session, then update. ────
  const supabase = await supabaseServer();
  const code = parsed.data.code;
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.json({ ok: false, error: "This reset link is invalid or has expired." }, { status: 400 });
    }
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
