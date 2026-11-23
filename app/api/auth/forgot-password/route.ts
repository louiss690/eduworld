import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isDemoDataMode } from "@/lib/env";
import { supabaseServer } from "@/services/auth/session";
import { forgotSchema } from "@/services/auth/schemas";
import { getSiteUrl } from "@/lib/env";

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
  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const { email } = parsed.data;

  // ── Demo mode: no mail transport exists; answer neutrally so the flow is
  // usable, and say so explicitly. ────────────────────────────────────────
  if (isDemoDataMode()) {
    return NextResponse.json({
      ok: true,
      demoNotice:
        "Demo mode: no email is sent. Use the reset form with the account's current email to set a new password.",
    });
  }

  // ── Supabase mode ──────────────────────────────────────────────────────
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/reset-password`,
  });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
