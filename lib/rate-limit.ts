/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Sufficient for a single-instance deployment. For multi-instance
 * production use, swap this for a shared store (e.g. Redis). The API
 * layer applies limits per IP and per user where applicable.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

export function rateLimit(
  key: string,
  opts: { windowMs?: number; max?: number } = {}
): { ok: boolean; retryAfterMs: number } {
  const windowMs = opts.windowMs ?? WINDOW_MS;
  const max = opts.max ?? MAX_REQUESTS;
  const now = Date.now();

  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    buckets.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
  if (bucket.timestamps.length >= max) {
    const oldest = bucket.timestamps[0] ?? now;
    return { ok: false, retryAfterMs: Math.max(0, windowMs - (now - oldest)) };
  }

  bucket.timestamps.push(now);
  return { ok: true, retryAfterMs: 0 };
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]!.trim() : "local";
  return `${ip}:${new URL(request.url).pathname}`;
}
