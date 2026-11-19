import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { LessonBlocks } from "@/components/lessons/LessonBlocks";
import { MarkCompleteButton } from "@/components/lessons/MarkCompleteButton";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const dynamic = "force-dynamic";

interface LessonPageParams {
  slug: string;
  lessonId: string;
}

export default async function LessonPage({ params }: { params: Promise<LessonPageParams> }) {
  const { slug, lessonId } = await params;
  const user = await requireRole("student");

  const store = getDataStore();
  const course = await store.getCourseBySlug(slug);
  if (!course || !course.published) notFound();

  const lessons = await store.getLessonsForCourse(course.id);
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) notFound();
  const quiz = await store.getQuizForCourse(course.id);

  const enrolled = await store.isEnrolled(user.id, course.id);
  const progress = await store.getProgressForUser(user.id);
  const completedLessonIds = new Set(
    progress.filter((p) => p.courseId === course.id && p.status === "completed").map((p) => p.lessonId)
  );

  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  return (
    <div className="bg-paper">
      <div className="wrap py-6">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          <ArrowLeft className="size-4" /> {course.title}
        </Link>
      </div>

      <div className="wrap grid grid-cols-1 gap-10 pb-16 lg:grid-cols-[280px_1fr]">
        {/* Lesson list sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Lessons">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Course lessons</p>
            {lessons.map((l) => {
              const active = l.id === lesson.id;
              const done = completedLessonIds.has(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/courses/${course.slug}/lessons/${l.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                    active ? "bg-white text-navy-950 shadow-sm ring-1 ring-line" : "text-navy-700 hover:bg-white/60"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                      done ? "bg-emerald-100 text-emerald-700" : active ? "bg-brand-600 text-white" : "bg-navy-100 text-navy-700"
                    }`}
                  >
                    {done ? "✓" : l.order}
                  </span>
                  <span className="leading-snug">{l.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Lesson content */}
        <article className="card overflow-hidden">
          <header className="border-b border-line px-6 py-7 sm:px-10">
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
              <span className="badge">Lesson {lesson.order} of {lessons.length}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" /> {lesson.minutes} min
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="mt-2 text-base text-muted">{lesson.description}</p>

            {lesson.objectives.length > 0 && (
              <div className="mt-6 rounded-xl bg-paper px-5 py-4">
                <p className="text-sm font-semibold text-navy-900">By the end of this lesson, you will be able to:</p>
                <ul className="mt-2.5 space-y-1.5">
                  {lesson.objectives.map((obj, i) => (
                    <li key={i} className="flex gap-2 text-sm text-navy-800">
                      <span className="mt-0.5 text-brand-600">•</span> {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </header>

          <div className="px-6 py-8 sm:px-10">
            <LessonBlocks blocks={lesson.blocks} />
          </div>

          <footer className="flex flex-col items-start justify-between gap-4 border-t border-line px-6 py-6 sm:flex-row sm:items-center sm:px-10">
            <MarkCompleteButton lessonId={lesson.id} initialCompleted={completedLessonIds.has(lesson.id)} />

            {!enrolled && (
              <p className="text-sm text-muted">
                Enroll in this course to save your progress:{" "}
                <Link href={`/courses/${course.slug}`} className="font-semibold text-brand-700 hover:text-brand-800">
                  Enroll free
                </Link>
              </p>
            )}
          </footer>
        </article>
      </div>

      {/* Prev / next */}
      <div className="border-t border-line bg-white">
        <div className="wrap flex flex-col items-stretch justify-between gap-3 py-6 sm:flex-row">
          {prev ? (
            <Link href={`/courses/${course.slug}/lessons/${prev.id}`} className="btn-secondary justify-start">
              <ArrowLeft className="size-4" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/courses/${course.slug}/lessons/${next.id}`} className="btn-primary">
              Next: {next.title} <ArrowRight className="size-4" />
            </Link>
          ) : quiz ? (
            <Link href={`/courses/${course.slug}/quiz/${quiz.id}`} className="btn-primary">
              Take the checkpoint quiz <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}

