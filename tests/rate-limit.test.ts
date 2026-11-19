import { describe, expect, it, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows requests under the limit and rejects overflow", () => {
    const first = rateLimit("k1", { max: 3 });
    expect(first.ok).toBe(true);
    rateLimit("k1", { max: 3 });
    rateLimit("k1", { max: 3 });
    const overflow = rateLimit("k1", { max: 3 });
    expect(overflow.ok).toBe(false);
    expect(overflow.retryAfterMs).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", () => {
    rateLimit("a", { max: 1 });
    const b = rateLimit("b", { max: 1 });
    expect(b.ok).toBe(true);
  });

  it("expires entries after the window", () => {
    vi.useFakeTimers();
    try {
      rateLimit("k2", { max: 1, windowMs: 1000 });
      const blocked = rateLimit("k2", { max: 1, windowMs: 1000 });
      expect(blocked.ok).toBe(false);
      vi.advanceTimersByTime(1100);
      const allowed = rateLimit("k2", { max: 1, windowMs: 1000 });
      expect(allowed.ok).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
