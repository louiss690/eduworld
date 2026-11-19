import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const runtime = "nodejs";

const patchSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["student", "teacher", "admin"]),
});

const deleteSchema = z.object({
  userId: z.string().min(1),
});

export async function PATCH(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 40 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  await requireRole("admin");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input." }, { status: 400 });
  }

  const store = getDataStore();
  const target = await store.getUserById(parsed.data.userId);
  if (!target) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  await store.updateUserRole(parsed.data.userId, parsed.data.role);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 20 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }
  await requireRole("admin");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input." }, { status: 400 });
  }

  const store = getDataStore();
  const target = await store.getUserById(parsed.data.userId);
  if (!target) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }
  if (target.id === "user-admin") {
    return NextResponse.json({ ok: false, error: "The built-in admin account cannot be removed." }, { status: 400 });
  }

  await store.deleteUser(parsed.data.userId);
  return NextResponse.json({ ok: true });
}
