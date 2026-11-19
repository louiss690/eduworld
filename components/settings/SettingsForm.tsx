"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Country, EducationalLevel, Language } from "@/types";

export function SettingsForm({
  initial,
  countries,
  languages,
  levels,
}: {
  initial: {
    name: string;
    email: string;
    countryCode: string;
    languageCode: string;
    educationLevelId: string;
    bio: string;
  };
  countries: Country[];
  languages: Language[];
  levels: EducationalLevel[];
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryCode: form.countryCode || null,
          languageCode: form.languageCode || null,
          educationLevelId: form.educationLevelId || null,
          bio: form.bio || null,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save your profile.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-5">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" /> Profile saved.
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label-form">Full name</label>
          <input id="name" type="text" className="input-field" value={form.name} onChange={update("name")} />
        </div>
        <div>
          <label htmlFor="email" className="label-form">Email</label>
          <input id="email" type="email" className="input-field" value={form.email} disabled />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

      <div>
        <label htmlFor="bio" className="label-form">Short bio (optional)</label>
        <textarea id="bio" rows={3} maxLength={500} className="input-field resize-none" placeholder="What are you hoping to learn?" value={form.bio} onChange={update("bio")} />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </button>
      </div>
    </form>
  );
}
