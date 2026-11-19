import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";
import type { BookmarkTarget } from "@/types";

export const runtime = "nodejs";

const bodySchema = z.object({
  targetType: z.enum(["course", "lesson", "material"]),
  targetId: z.string().min(1).max(120),
});

function validTarget(store: ReturnType<typeof getDataStore>, type: BookmarkTarget, id: string) {
  if (type === "course") return store.getCourseById(id);
  if (type === "lesson") return store.getLessonById(id);
  return Promise.resolve(null);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to view bookmarks." }, { status: 401 });
  }
  const bookmarks = await getDataStore().listBookmarks(user.id);
  return NextResponse.json({ bookmarks });
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 60 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to bookmark content." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const store = getDataStore();
  const target = await validTarget(store, parsed.data.targetType, parsed.data.targetId);
  if (!target) {
    return NextResponse.json({ ok: false, error: "The item to bookmark was not found." }, { status: 404 });
  }

  const bookmark = await store.addBookmark(user.id, parsed.data.targetType, parsed.data.targetId);
  return NextResponse.json({ ok: true, bookmark });
}

export async function DELETE(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 60 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to manage bookmarks." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  await getDataStore().removeBookmark(user.id, parsed.data.targetType, parsed.data.targetId);
  return NextResponse.json({ ok: true });
}
