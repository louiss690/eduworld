import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FileCheck2,
  PlayCircle,
} from "lucide-react";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { getDataStore } from "@/services/data";
import { formatDurationMinutes } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth/session";

export const dynamic = "force-dynamic";

interface CoursePageParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CoursePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getDataStore().getCourseBySlug(slug);
  return {
    title: course?.title ?? "Course",
    description: course?.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<CoursePageParams>;
}) {
  const { slug } = await params;
  const store = getDataStore();
  const course = await store.getCourseBySlug(slug);
  if (!course || !course.published) notFound();

  const [lessons, quiz, user, subjects] = await Promise.all([
    store.getLessonsForCourse(course.id),
    store.getQuizForCourse(course.id),
    getCurrentUser(),
    store.getSubjects(),
  ]);

  const subject = subjects.find((s) => s.id === course.subjectId);
  const totalMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0);

  const enrolled = user ? await store.isEnrolled(user.id, course.id) : false;
  const progress = user ? await store.getProgressForUser(user.id) : [];
  const completedLessonIds = new Set(
    progress.filter((p) => p.courseId === course.id && p.status === "completed").map((p) => p.lessonId)
  );
  const completedCount = lessons.filter((l) => completedLessonIds.has(l.id)).length;

  return (
    <div>
      {/* Course hero */}
      <section className="border-b border-line bg-deep text-white">
        <div className="wrap grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_400px] lg:py-16">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {subject && (
                <Link href={`/subjects/${subject.slug}`} className="badge border-white/20 bg-white/10 text-white hover:bg-white/20">
                  {subject.name}
                </Link>
              )}
              <span className="badge border-white/20 bg-white/10 capitalize text-white">{course.level}</span>
              <span className="badge border-white/20 bg-white/10 text-white">English</span>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-deep-2">{course.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-deep-2">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-4" /> {lessons.length} lessons
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" /> {formatDurationMinutes(totalMinutes)} total
              </span>
              {quiz && (
                <span className="inline-flex items-center gap-1.5">
                  <FileCheck2 className="size-4" /> Checkpoint quiz
                </span>
              )}
            </div>
            <div className="mt-8 max-w-sm">
              <EnrollButton courseId={course.id} courseSlug={course.slug} initialEnrolled={enrolled} />
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-2xl lg:block">
            <div className="aspect-[4/3] bg-navy-800">
              {course.imageUrl && (
                <Image
                  src={course.imageUrl}
                  alt=""
                  fill
                  sizes="400px"
                  className="object-cover opacity-90"
                />
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1428]/90 to-transparent p-5">
              <p className="text-sm font-medium text-white">{course.instructor.name}</p>
              <p className="text-[13px] text-deep-2">{course.instructor.title}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="wrap grid grid-cols-1 gap-12 py-12 lg:grid-cols-[1fr_320px] lg:py-16">
        <div>
          <h2 className="text-xl font-bold text-navy-950">About this course</h2>
          <p className="mt-4 text-[15.5px] leading-relaxed text-ink/90">{course.longDescription}</p>

          <h2 className="mt-12 text-xl font-bold text-navy-950">
            Lessons <span className="text-sm font-normal text-muted">({completedCount}/{lessons.length} completed)</span>
          </h2>
          <ol className="mt-5 space-y-3">
            {lessons.map((lesson) => {
              const done = completedLessonIds.has(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${course.slug}/lessons/${lesson.id}`}
                    className="card flex items-center gap-4 p-4 transition-shadow hover:shadow-md"
                  >
                    {done ? (
                      <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-label="Completed" />
                    ) : (
                      <Circle className="size-5 shrink-0 text-navy-200" aria-label="Not started" />
                    )}
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-navy-950">
                        {lesson.order}. {lesson.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">{lesson.description}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
                      <Clock className="size-3.5" /> {lesson.minutes} min
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-navy-950">Course details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Subject</dt>
                <dd className="font-medium text-navy-900">{subject?.name ?? "General"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Level</dt>
                <dd className="font-medium capitalize text-navy-900">{course.level}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Lessons</dt>
                <dd className="font-medium text-navy-900">{lessons.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Estimated time</dt>
                <dd className="font-medium text-navy-900">{formatDurationMinutes(totalMinutes)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Instructor</dt>
                <dd className="text-right font-medium text-navy-900">{course.instructor.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Language</dt>
                <dd className="font-medium text-navy-900">English</dd>
              </div>
            </dl>
          </div>

          {quiz && (
            <div className="card p-6">
              <h3 className="text-base font-semibold text-navy-950">Checkpoint quiz</h3>
              <p className="mt-2 text-sm text-muted">{quiz.title}</p>
              <Link href={`/courses/${course.slug}/quiz/${quiz.id}`} className="btn-ghost mt-4 w-full px-4">
                <PlayCircle className="size-4" /> Take the quiz
              </Link>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
