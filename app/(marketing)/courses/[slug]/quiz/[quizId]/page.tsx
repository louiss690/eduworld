import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { getDataStore } from "@/services/data";
import { toPublicQuestions } from "@/services/quizzes";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

interface QuizPageParams {
  slug: string;
  quizId: string;
}

export default async function QuizPage({ params }: { params: Promise<QuizPageParams> }) {
  const { slug, quizId } = await params;
  await requireRole("student");

  const store = getDataStore();
  const course = await store.getCourseBySlug(slug);
  if (!course) notFound();

  const quiz = await store.getQuizById(quizId);
  if (!quiz || !quiz.published || quiz.courseId !== course.id) notFound();

  return (
    <div className="bg-paper">
      <div className="wrap py-10 pb-16">
        <QuizRunner
          quizId={quiz.id}
          courseSlug={course.slug}
          courseTitle={course.title}
          title={quiz.title}
          questions={toPublicQuestions(quiz)}
          passingScore={quiz.passingScore}
          timeLimitMinutes={quiz.timeLimitMinutes}
        />
      </div>
    </div>
  );
}
