"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Plus } from "lucide-react";
import type { Course } from "@/types";

export function AddLessonForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ courseId: "", title: "", description: "", minutes: 10 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setCreated(false);
    try {
      const res = await fetch("/api/teacher/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, minutes: Number(form.minutes) }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not create the lesson.");
        return;
      }
      setCreated(true);
      setForm((f) => ({ ...f, title: "", description: "" }));
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
          <CheckCircle2 className="size-4" /> Lesson added to the course.
        </div>
      )}
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="course" className="label-form">Course</label>
        <select id="course" required className="input-field" value={form.courseId} onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}>
          <option value="">Select a course…</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lesson-title" className="label-form">Lesson title</label>
        <input id="lesson-title" type="text" required minLength={3} className="input-field" placeholder="e.g. Adding and subtracting fractions" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="lesson-desc" className="label-form">Description (optional)</label>
        <input id="lesson-desc" type="text" className="input-field" placeholder="What will students learn?" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>
      <div>
        <label htmlFor="minutes" className="label-form">Estimated minutes</label>
        <input id="minutes" type="number" min={1} max={600} className="input-field" value={form.minutes} onChange={(e) => setForm((f) => ({ ...f, minutes: Number(e.target.value) }))} />
      </div>

      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        Add lesson
      </button>
    </form>
  );
}
