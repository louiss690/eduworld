"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ResetForm() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password, code }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Reset failed. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-4 text-sm text-brand-800">
        <p className="font-semibold">Password updated.</p>
        <p className="mt-1.5">You can now sign in with your new password.</p>
        <p className="mt-4">
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Go to sign in →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="label-form">Account email</label>
        <input id="email" type="email" autoComplete="email" required className="input-field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password" className="label-form">New password</label>
        <input id="password" type="password" autoComplete="new-password" required minLength={8} className="input-field" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : "Reset password"}
      </button>
    </form>
  );
}
