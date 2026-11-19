import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  courseId: z.string().min(1).max(80),
  title: z.string().trim().min(3).max(140),
  description: z.string().trim().max(500).optional().default(""),
  minutes: z.number().int().min(1).max(600).default(10),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 20 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  await requireRole("teacher");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const store = getDataStore();
  const course = await store.getCourseById(parsed.data.courseId);
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });
  }

  const lessons = await store.getLessonsForCourse(course.id);
  const lesson = await store.createLesson({
    courseId: course.id,
    title: parsed.data.title,
    description: parsed.data.description,
    objectives: [],
    blocks: [{ type: "paragraph", text: "Content coming soon from your teaching team." }],
    minutes: parsed.data.minutes,
    order: lessons.length + 1,
  });

  return NextResponse.json({ ok: true, lesson });
}
