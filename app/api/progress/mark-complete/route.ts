import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  lessonId: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 40 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to track progress." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid lesson." }, { status: 400 });
  }

  const store = getDataStore();
  const lesson = await store.getLessonById(parsed.data.lessonId);
  if (!lesson) {
    return NextResponse.json({ ok: false, error: "Lesson not found." }, { status: 404 });
  }

  await store.markLessonComplete(user.id, lesson.courseId, lesson.id);
  const { evaluateAchievements } = await import("@/services/achievements");
  await evaluateAchievements(user.id, store);
  return NextResponse.json({ ok: true });
}
