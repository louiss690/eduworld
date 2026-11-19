import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  title: z.string().trim().min(3).max(140),
  subjectId: z.string().min(1).max(40),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  description: z.string().trim().min(10).max(500),
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
  const course = await store.createCourse({
    slug: parsed.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: parsed.data.title,
    subjectId: parsed.data.subjectId,
    level: parsed.data.level,
    format: "course",
    description: parsed.data.description,
    longDescription: parsed.data.description,
    imageUrl: null,
    instructor: { name: "Your name", title: "Teacher" },
    published: false,
    featured: false,
  });

  return NextResponse.json({ ok: true, course });
}
