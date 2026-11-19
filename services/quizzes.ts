import type {
  GradedQuestion,
  Question,
  Quiz,
  QuizAnswer,
  QuizAttempt,
} from "@/types";

export interface GradedResult {
  scorePct: number;
  passed: boolean;
  correctCount: number;
  total: number;
  answers: GradedQuestion[];
}

/** Normalise short-answer text for forgiving comparison. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

function isCorrect(question: Question, given: QuizAnswer["given"]): boolean {
  if (question.type === "short_answer") {
    if (!question.correctAnswer) return false;
    const expected = normalizeAnswer(question.correctAnswer);
    const actual = normalizeAnswer(String(given));
    if (actual === expected) return true;
    // Accept any one of comma-separated accepted answers.
    return expected
      .split(",")
      .map((part) => normalizeAnswer(part))
      .includes(actual);
  }
  return Number(given) === question.correctIndex;
}

/** Grade a full quiz attempt. Never called with answers the client can see. */
export function gradeQuiz(quiz: Quiz, answers: QuizAnswer[]): GradedResult {
  const byQuestion = new Map(answers.map((a) => [a.questionId, a]));
  const graded: GradedQuestion[] = quiz.questions.map((question) => {
    const given = byQuestion.get(question.id)?.given ?? "";
    const correct = isCorrect(question, given);
    return {
      questionId: question.id,
      given,
      correct,
      explanation: question.explanation,
    };
  });

  const correctCount = graded.filter((g) => g.correct).length;
  const total = quiz.questions.length;
  const scorePct = total === 0 ? 0 : Math.round((correctCount / total) * 100);

  return {
    scorePct,
    passed: scorePct >= quiz.passingScore,
    correctCount,
    total,
    answers: graded,
  };
}

export function buildAttempt(
  userId: string,
  quiz: Quiz,
  result: GradedResult
): QuizAttempt {
  return {
    id: `${userId.slice(0, 8)}-${Date.now()}`,
    userId,
    quizId: quiz.id,
    scorePct: result.scorePct,
    passed: result.passed,
    correctCount: result.correctCount,
    total: result.total,
    answers: result.answers,
    completedAt: new Date().toISOString(),
  };
}

/** Public quiz shape (no correct answers) for the quiz UI. */
export function toPublicQuestions(quiz: Quiz) {
  return quiz.questions.map((q) => ({
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    options: q.options,
  }));
}
