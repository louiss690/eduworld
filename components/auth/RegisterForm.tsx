"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/services/auth/auth-context";
import type { Country, EducationalLevel, Language } from "@/types";

export function RegisterForm({
  countries,
  languages,
  levels,
}: {
  countries: Country[];
  languages: Language[];
  levels: EducationalLevel[];
}) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "",
    languageCode: "en",
    educationLevelId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        needsVerification?: boolean;
        demoNotice?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      if (data.needsVerification) {
        setNotice(data.demoNotice ?? "Check your email to verify your account.");
        return;
      }
      await refresh();
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {notice && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-3 text-sm text-brand-800">
          {notice}
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label-form">Full name</label>
        <input id="name" type="text" autoComplete="name" required className="input-field" placeholder="Amina Okoye" value={form.name} onChange={update("name")} />
      </div>

      <div>
        <label htmlFor="email" className="label-form">Email address</label>
        <input id="email" type="email" autoComplete="email" required className="input-field" placeholder="you@example.com" value={form.email} onChange={update("email")} />
      </div>

      <div>
        <label htmlFor="password" className="label-form">Password</label>
        <input id="password" type="password" autoComplete="new-password" required minLength={8} className="input-field" placeholder="At least 8 characters" value={form.password} onChange={update("password")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="label-form">Country</label>
          <select id="country" className="input-field" value={form.countryCode} onChange={update("countryCode")}>
            <option value="">Select…</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="label-form">Preferred language</label>
          <select id="language" className="input-field" value={form.languageCode} onChange={update("languageCode")}>
            {languages.map((l) => (
              <option key={l.code} value={l.code} disabled={!l.available}>
                {l.name}{!l.available ? " (coming soon)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="level" className="label-form">Educational level</label>
        <select id="level" className="input-field" value={form.educationLevelId} onChange={update("educationLevelId")}>
          <option value="">Select…</option>
          {levels.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </button>
    </form>
  );
}
