import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const runtime = "nodejs";

const bodySchema = z.object({
  reportId: z.string().min(1),
  status: z.enum(["open", "resolved", "dismissed"]),
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
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid input." }, { status: 400 });
  }

  await getDataStore().updateReportStatus(parsed.data.reportId, parsed.data.status);
  return NextResponse.json({ ok: true });
}
