import { NextResponse } from "next/server";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const store = getDataStore();
  const conversation = await store.getConversation(id);
  if (!conversation || conversation.conversation.userId !== user.id) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(conversation);
}
