"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GradedQuestion } from "@/types";

export interface PublicQuestion {
  id: string;
  type: string;
  prompt: string;
  options: string[];
}

interface QuizResult {
  scorePct: number;
  passed: boolean;
  correctCount: number;
  total: number;
  answers: GradedQuestion[];
}

export function QuizRunner({
  quizId,
  courseSlug,
  courseTitle,
  title,
  questions,
  passingScore,
  timeLimitMinutes,
}: {
  quizId: string;
  courseSlug: string;
  courseTitle: string;
  title: string;
  questions: PublicQuestion[];
  passingScore: number;
  timeLimitMinutes: number | null;
}) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(
    timeLimitMinutes ? timeLimitMinutes * 60 : null
  );
  const submittedRef = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      void submit(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result]);

  async function submit(auto = false) {
    if (submittedRef.current) return;
    if (!auto && !allAnswered) {
      setError("Answer every question before submitting.");
      return;
    }
    submittedRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          answers: questions.map((q) => ({
            questionId: q.id,
            given: answers[q.id] ?? "",
          })),
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; result?: QuizResult };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Submission failed. Please try again.");
        submittedRef.current = false;
        return;
      }
      setResult(data.result!);
    } catch {
      setError("Network error. Please try again.");
      submittedRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  function setAnswer(questionId: string, value: string | number) {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    setError(null);
  }

  const minutes = secondsLeft === null ? null : Math.floor(secondsLeft / 60);
  const seconds = secondsLeft === null ? null : secondsLeft % 60;

  // ── Results view ───────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card overflow-hidden">
          <div className={cn("px-8 py-8 text-center", result.passed ? "bg-emerald-50" : "bg-amber-50")}>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Result</p>
            <p className="mt-2 text-6xl font-bold text-navy-950">{result.scorePct}%</p>
            <p className="mt-2 text-base font-medium text-navy-800">
              {result.correctCount} of {result.total} correct
            </p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface1 px-4 py-1.5 text-sm font-semibold">
              {result.passed ? (
                <><Award className="size-4 text-gold-600" /> Passed · {passingScore}% needed</>
              ) : (
                <><AlertCircle className="size-4 text-amber-600" /> Not passed · {passingScore}% needed</>
              )}
            </p>
            {result.passed && (
              <p className="mt-2 text-sm text-muted">Well done — you&apos;re building momentum!</p>
            )}
          </div>

          <div className="border-t border-line px-8 py-6">
            <h2 className="text-base font-semibold text-navy-950">Review your answers</h2>
            <ul className="mt-5 space-y-5">
              {questions.map((q, i) => {
                const graded = result.answers.find((a) => a.questionId === q.id);
                const isShort = q.type === "short_answer";
                const chosenIndex = typeof graded?.given === "number" ? graded.given : -1;
                return (
                  <li key={q.id} className="rounded-xl border border-line p-5">
                    <div className="flex gap-3">
                      {graded?.correct ? (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                      ) : (
                        <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-950">
                          {i + 1}. {q.prompt}
                        </p>
                        {q.type === "true_false" && (
                          <p className="mt-2 text-sm">
                            <span className="text-muted">Your answer: </span>
                            <span className="font-medium text-navy-900">{q.options[chosenIndex] ?? "—"}</span>
                          </p>
                        )}
                        {q.type === "multiple_choice" && (
                          <p className="mt-2 text-sm">
                            <span className="text-muted">Your answer: </span>
                            <span className="font-medium text-navy-900">
                              {q.options[chosenIndex] ?? "—"}
                            </span>
                          </p>
                        )}
                        {isShort && (
                          <p className="mt-2 text-sm">
                            <span className="text-muted">Your answer: </span>
                            <span className="font-medium text-navy-900">{String(graded?.given ?? "—")}</span>
                          </p>
                        )}
                        <p className="mt-3 rounded-lg bg-paper px-3.5 py-2.5 text-[13px] leading-relaxed text-navy-800">
                          {graded?.explanation}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/courses/${courseSlug}`} className="btn-secondary">
            <ArrowLeft className="size-4" /> Back to course
          </Link>
          <Link href="/dashboard" className="btn-ghost">Go to dashboard</Link>
        </div>
      </div>
    );
  }

  // ── Quiz view ──────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/courses/${courseSlug}`} className="text-sm font-medium text-brand-700 hover:text-brand-800">
            ← {courseTitle}
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-navy-950">{title}</h1>
        </div>
        {secondsLeft !== null && (
          <div className={cn("rounded-lg border px-4 py-2 text-sm font-semibold tabular-nums", secondsLeft < 60 ? "border-red-200 bg-red-50 text-red-700" : "border-line bg-paper text-navy-800")}>
            {minutes}:{String(seconds).padStart(2, "0")} left
          </div>
        )}
      </div>

      <div className="card divide-y divide-line">
        {questions.map((q, i) => {
          const current = answers[q.id];
          return (
            <fieldset key={q.id} className="px-6 py-6 sm:px-8">
              <legend className="sr-only">Question {i + 1}</legend>
              <p className="text-sm font-semibold text-navy-950">
                <span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-deep text-xs text-white">
                  {i + 1}
                </span>
                {q.prompt}
              </p>

              {q.type === "short_answer" ? (
                <input
                  type="text"
                  value={typeof current === "string" ? current : ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder="Type your answer…"
                  className="input-field mt-4"
                  aria-label={`Answer for question ${i + 1}`}
                />
              ) : (
                <div className="mt-4 grid gap-2.5">
                  {q.options.map((option, oi) => {
                    const selected = current === oi;
                    return (
                      <label
                        key={oi}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                          selected
                            ? "border-brand-400 bg-brand-50 font-medium text-brand-900"
                            : "border-line hover:border-navy-300 hover:bg-paper"
                        )}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          className="size-4 accent-brand-600"
                          checked={selected}
                          onChange={() => setAnswer(q.id, oi)}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          {answeredCount} of {questions.length} answered
        </p>
        <button type="button" onClick={() => submit(false)} disabled={submitting} className="btn-primary btn-lg">
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          Submit quiz
        </button>
      </div>
    </div>
  );
}
