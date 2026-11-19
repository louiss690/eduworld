"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth/auth-context";

export function EnrollButton({
  courseId,
  courseSlug,
  initialEnrolled = false,
}: {
  courseId: string;
  courseSlug: string;
  initialEnrolled?: boolean;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEnroll() {
    if (!user) {
      router.push(`/login?next=/courses/${courseSlug}`);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Enrollment failed. Please try again.");
        return;
      }
      setEnrolled(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (enrolled) {
    return (
      <div className="flex flex-col gap-3">
        <a href={`/courses/${courseSlug}/lessons/start`} className="btn-primary btn-lg">
          Continue learning <ArrowRight className="size-4" />
        </a>
        <a href="/dashboard" className="btn-secondary">
          Go to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onEnroll}
        disabled={busy || authLoading}
        className="btn-primary btn-lg"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : user ? "Enroll free" : "Sign in to enroll"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
