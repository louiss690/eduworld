import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  courseId: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 20 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to enroll." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid course." }, { status: 400 });
  }

  const store = getDataStore();
  const course = await store.getCourseById(parsed.data.courseId);
  if (!course || !course.published) {
    return NextResponse.json({ ok: false, error: "Course not found." }, { status: 404 });
  }

  const enrollment = await store.enroll(user.id, course.id);
  await store.addNotification({
    userId: user.id,
    type: "enrollment",
    title: "You're enrolled",
    body: `You are now learning "${course.title}". Good luck!`,
  });
  return NextResponse.json({ ok: true, enrollment });
}
