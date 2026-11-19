import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";
import { buildAttempt, gradeQuiz } from "@/services/quizzes";
import { evaluateAchievements } from "@/services/achievements";

export const runtime = "nodejs";

const bodySchema = z.object({
  quizId: z.string().min(1).max(80),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      given: z.union([z.string(), z.number()]),
    })
  ),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request), { max: 20 });
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in to submit a quiz." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }

  const store = getDataStore();
  const quiz = await store.getQuizById(parsed.data.quizId);
  if (!quiz || !quiz.published) {
    return NextResponse.json({ ok: false, error: "Quiz not found." }, { status: 404 });
  }

  // Reject submissions missing questions — grading must be complete.
  if (parsed.data.answers.length !== quiz.questions.length) {
    return NextResponse.json(
      { ok: false, error: "Please answer every question before submitting." },
      { status: 400 }
    );
  }

  const result = gradeQuiz(quiz, parsed.data.answers);
  const attempt = buildAttempt(user.id, quiz, result);
  await store.saveQuizAttempt(attempt);

  await store.addNotification({
    userId: user.id,
    type: "quiz_result",
    title: result.passed ? "Quiz passed 🎉" : "Quiz review",
    body: `${quiz.title}: ${result.scorePct}% (${result.correctCount}/${result.total}).`,
  });
  await evaluateAchievements(user.id, store);

  return NextResponse.json({ ok: true, result });
}
