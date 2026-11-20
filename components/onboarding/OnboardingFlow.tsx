"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Country, EducationalLevel, Language, Subject } from "@/types";

const STEPS = ["Welcome", "Your subjects", "Review"];

export function OnboardingFlow({
  user,
  subjects,
  countries,
  languages,
  levels,
  initial,
}: {
  user: { name: string };
  subjects: Subject[];
  countries: Country[];
  languages: Language[];
  levels: EducationalLevel[];
  initial: {
    countryCode: string;
    languageCode: string;
    educationLevelId: string;
    subjectIds: string[];
  };
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [subjectIds, setSubjectIds] = useState<string[]>(initial.subjectIds);
  const [form, setForm] = useState({
    countryCode: initial.countryCode,
    languageCode: initial.languageCode || "en",
    educationLevelId: initial.educationLevelId,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleSubject(id: string) {
    setSubjectIds((ids) =>
      ids.includes(id) ? ids.filter((s) => s !== id) : [...ids, id]
    );
  }

  async function finish() {
    if (subjectIds.length === 0) {
      setError("Pick at least one subject so we can personalise your dashboard.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subjectIds }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not save your preferences.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                i < step
                  ? "bg-emerald-100 text-emerald-700"
                  : i === step
                    ? "bg-brand-600 text-white"
                    : "bg-surface3 text-muted"
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm font-medium sm:block",
                i === step ? "text-navy-950" : "text-muted"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      <div className="card p-6 sm:p-8">
        {error && (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {step === 0 && (
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <Sparkles className="size-7" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-navy-950">
              Welcome, {user.name.split(" ")[0]}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted">
              Let&apos;s set up your learning space in under a minute. You can
              change everything later in Settings.
            </p>
            <button type="button" onClick={() => setStep(1)} className="btn-primary btn-lg mt-8">
              Get started <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-navy-950">What do you want to study?</h2>
            <p className="mt-2 text-sm text-muted">
              Pick one or more subjects, this personalises your recommendations.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {subjects.map((subject) => {
                const selected = subjectIds.includes(subject.id);
                return (
                  <li key={subject.id}>
                    <button
                      type="button"
                      onClick={() => toggleSubject(subject.id)}
                      aria-pressed={selected}
                      className={cn(
                        "w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                        selected
                          ? "border-brand-400 bg-brand-50 text-brand-800"
                          : "border-line bg-surface1 text-navy-800 hover:border-navy-300"
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        {subject.name}
                        {selected && <Check className="size-4 text-brand-600" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => setStep(0)} className="btn-ghost">
                <ArrowLeft className="size-4" /> Back
              </button>
              <button type="button" onClick={() => setStep(2)} className="btn-primary" disabled={subjectIds.length === 0}>
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-navy-950">Almost there</h2>
            <p className="mt-2 text-sm text-muted">Confirm your details, you can update these any time.</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="ob-country" className="label-form">Country</label>
                <select id="ob-country" className="input-field" value={form.countryCode} onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}>
                  <option value="">Select…</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ob-language" className="label-form">Preferred language</label>
                <select id="ob-language" className="input-field" value={form.languageCode} onChange={(e) => setForm((f) => ({ ...f, languageCode: e.target.value }))}>
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} disabled={!l.available}>
                      {l.name}{!l.available ? " (coming soon)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ob-level" className="label-form">Educational level</label>
                <select id="ob-level" className="input-field" value={form.educationLevelId} onChange={(e) => setForm((f) => ({ ...f, educationLevelId: e.target.value }))}>
                  <option value="">Select…</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-surface2 p-5">
              <p className="text-sm font-semibold text-navy-950">Your subjects</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {subjectIds.map((id) => {
                  const subject = subjects.find((s) => s.id === id);
                  return subject ? (
                    <span key={id} className="badge">{subject.name}</span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                <ArrowLeft className="size-4" /> Back
              </button>
              <button type="button" onClick={finish} className="btn-primary btn-lg" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                Enter my dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/dashboard" className="font-medium text-brand-700 hover:text-brand-800">
          Skip for now
        </Link>
      </p>
    </div>
  );
}
