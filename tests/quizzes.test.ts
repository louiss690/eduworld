import { describe, expect, it } from "vitest";
import { gradeQuiz, normalizeAnswer, toPublicQuestions } from "@/services/quizzes";
import type { Quiz } from "@/types";

const quiz: Quiz = {
  id: "quiz-test",
  courseId: "course-test",
  lessonId: null,
  title: "Test",
  description: "",
  passingScore: 60,
  timeLimitMinutes: null,
  published: true,
  questions: [
    { id: "q1", type: "multiple_choice", prompt: "2 + 2?", options: ["3", "4", "5"], correctIndex: 1, correctAnswer: null, explanation: "2+2=4" },
    { id: "q2", type: "true_false", prompt: "Earth is flat.", options: ["True", "False"], correctIndex: 1, correctAnswer: null, explanation: "Earth is round." },
    { id: "q3", type: "short_answer", prompt: "Capital of France?", options: [], correctIndex: -1, correctAnswer: "Paris", explanation: "Paris" },
  ],
};

describe("gradeQuiz", () => {
  it("grades a perfect attempt", () => {
    const result = gradeQuiz(quiz, [
      { questionId: "q1", given: 1 },
      { questionId: "q2", given: 1 },
      { questionId: "q3", given: "Paris" },
    ]);
    expect(result.correctCount).toBe(3);
    expect(result.scorePct).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("accepts case-insensitive and trimmed short answers", () => {
    const result = gradeQuiz(quiz, [
      { questionId: "q1", given: 1 },
      { questionId: "q2", given: 1 },
      { questionId: "q3", given: "  paris " },
    ]);
    expect(result.correctCount).toBe(3);
  });

  it("marks wrong answers and computes score", () => {
    const result = gradeQuiz(quiz, [
      { questionId: "q1", given: 0 },
      { questionId: "q2", given: 0 },
      { questionId: "q3", given: "London" },
    ]);
    expect(result.correctCount).toBe(0);
    expect(result.scorePct).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("computes pass/fail against the passing score", () => {
    const result = gradeQuiz(quiz, [
      { questionId: "q1", given: 1 },
      { questionId: "q2", given: 0 },
      { questionId: "q3", given: "Paris" },
    ]);
    expect(result.scorePct).toBe(67);
    expect(result.passed).toBe(true);
  });
});

describe("normalizeAnswer", () => {
  it("normalises case, punctuation and whitespace", () => {
    expect(normalizeAnswer("  PARIS! ")).toBe("paris");
    expect(normalizeAnswer("Claim, Evidence, Reasoning")).toBe("claim, evidence, reasoning");
  });
});

describe("toPublicQuestions", () => {
  it("never exposes correct answers", () => {
    const publicQuestions = toPublicQuestions(quiz);
    for (const q of publicQuestions) {
      expect(q).not.toHaveProperty("correctIndex");
      expect(q).not.toHaveProperty("correctAnswer");
      expect(q).not.toHaveProperty("explanation");
    }
  });
});
