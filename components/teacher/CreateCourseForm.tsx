"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import type { Subject } from "@/types";

export function CreateCourseForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", subjectId: "", level: "beginner", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setCreated(null);
    try {
      const res = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; course?: { slug: string } };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create the course.");
        return;
      }
      setCreated(data.course?.slug ?? null);
      setForm({ title: "", subjectId: "", level: "beginner", description: "" });
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {created && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" /> Course created — it is unpublished until an admin publishes it.
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="label-form">Course title</label>
        <input id="title" type="text" required minLength={3} className="input-field" placeholder="e.g. Fractions Made Simple" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subject" className="label-form">Subject</label>
          <select id="subject" required className="input-field" value={form.subjectId} onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}>
            <option value="">Select…</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="label-form">Level</label>
          <select id="level" className="input-field" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="label-form">Short description</label>
        <textarea id="description" rows={3} required minLength={10} maxLength={500} className="input-field resize-none" placeholder="What will students learn?" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>

      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Create course
      </button>
    </form>
  );
}
