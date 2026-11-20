import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDataStore } from "@/services/data";
import { requireUser } from "@/services/auth/session";
import type { QuizAttempt } from "@/types";

export const metadata: Metadata = {
  title: "My quiz results",
  description: "Review your past quiz attempts on EduWorld.",
};

export const dynamic = "force-dynamic";

interface AttemptView extends QuizAttempt {
  quizTitle: string;
  questionPrompts: Map<string, string>;
  questionOptions: Map<string, string[]>;
}

export default async function ResultsPage() {
  const user = await requireUser();
  const store = getDataStore();
  const attempts = await store.getAttemptsForUser(user.id);

  const views: AttemptView[] = [];
  for (const attempt of attempts) {
    const quiz = await store.getQuizById(attempt.quizId);
    const prompts = new Map<string, string>();
    const options = new Map<string, string[]>();
    for (const q of quiz?.questions ?? []) {
      prompts.set(q.id, q.prompt);
      options.set(q.id, q.options);
    }
    views.push({
      ...attempt,
      quizTitle: quiz?.title ?? "Quiz",
      questionPrompts: prompts,
      questionOptions: options,
    });
  }

  return (
    <div className="bg-surface2">
      <div className="wrap py-10">
        <p className="eyebrow">Assessment history</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
          My quiz results
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted">
          Review every attempt, your answers and the explanations, spot the
          topics to revisit.
        </p>

        {views.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-line bg-surface1 px-6 py-14 text-center">
            <FileCheck2 className="mx-auto size-10 text-navy-200" />
            <h2 className="mt-4 font-semibold text-navy-950">No attempts yet</h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Take a checkpoint quiz from any course and your results will appear here.
            </p>
            <Link href="/library" className="btn-primary mt-5">Browse courses</Link>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {views.map((attempt) => (
              <details key={attempt.id} id={`attempt-${attempt.id}`} className="card overflow-hidden" open={views.length === 1}>
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 [&::-webkit-details-marker]:hidden">
                  <span className={cn("grid size-12 place-items-center rounded-xl text-base font-bold", attempt.passed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                    {attempt.scorePct}%
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy-950">{attempt.quizTitle}</span>
                    <span className="block text-[13px] text-muted">
                      {attempt.correctCount}/{attempt.total} correct · {new Date(attempt.completedAt).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </span>
                  <span className="badge">{attempt.passed ? "Passed" : "Not passed"}</span>
                </summary>

                <div className="border-t border-line px-6 py-5">
                  <ul className="space-y-4">
                    {attempt.answers.map((a) => {
                      const prompt = attempt.questionPrompts.get(a.questionId) ?? "Question";
                      const options = attempt.questionOptions.get(a.questionId) ?? [];
                      const chosenLabel =
                        typeof a.given === "number" ? options[a.given] ?? "-" : String(a.given || "-");
                      return (
                        <li key={a.questionId} className={cn("rounded-xl border p-4", a.correct ? "border-emerald-200 bg-emerald-50/60" : "border-red-200 bg-red-50/50")}>
                          <div className="flex gap-3">
                            {a.correct ? (
                              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                            ) : (
                              <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-navy-950">{prompt}</p>
                              <p className="mt-1.5 text-sm text-navy-800">
                                Your answer: <span className="font-medium">{chosenLabel}</span>
                              </p>
                              <p className="mt-2.5 rounded-lg bg-surface1 px-3.5 py-2.5 text-[13px] leading-relaxed text-navy-800">
                                {a.explanation}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-5 flex justify-end gap-3">
                    <Link href="/dashboard" className="btn-secondary btn-sm">Back to dashboard</Link>
                    <Link href="/library" className="btn-ghost btn-sm">Find more quizzes</Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
