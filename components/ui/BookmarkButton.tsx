"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/services/auth/auth-context";
import type { BookmarkTarget } from "@/types";

export function BookmarkButton({
  targetType,
  targetId,
  initial = false,
  compact = false,
  className,
}: {
  targetType: BookmarkTarget;
  targetId: string;
  initial?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!user) {
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/bookmarks", {
        method: saved ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = (await res.json()) as { ok: boolean };
      if (res.ok && data.ok) {
        setSaved((v) => !v);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Bookmark this"}
      title={saved ? "Remove bookmark" : "Bookmark this"}
      className={cn(
        "btn-secondary",
        compact && "btn-sm",
        saved && "!border-brand-300 !bg-brand-50 !text-brand-700",
        className
      )}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Bookmark className={cn("size-4", saved && "fill-current")} />
      )}
      {!compact && (saved ? "Saved" : "Save")}
    </button>
  );
}
