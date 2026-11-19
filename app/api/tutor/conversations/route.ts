import { NextResponse } from "next/server";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const conversations = await getDataStore().listConversations(user.id);
  return NextResponse.json({ conversations });
}
