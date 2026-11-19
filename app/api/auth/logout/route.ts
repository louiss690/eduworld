import { NextResponse } from "next/server";
import { isDemoDataMode } from "@/lib/env";
import { destroyDemoSession, supabaseServer } from "@/services/auth/session";

export const runtime = "nodejs";

export async function POST() {
  if (!isDemoDataMode()) {
    const supabase = await supabaseServer();
    await supabase.auth.signOut();
  }
  await destroyDemoSession();
  return NextResponse.json({ ok: true });
}
