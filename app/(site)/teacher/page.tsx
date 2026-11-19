import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FileCheck2, GraduationCap, Users } from "lucide-react";
import { CreateCourseForm } from "@/components/teacher/CreateCourseForm";
import { AddLessonForm } from "@/components/teacher/AddLessonForm";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Teacher portal",
  description: "Create courses, lessons and quizzes on EduWorld.",
};

export const dynamic = "force-dynamic";

export default async function TeacherPage() {
  await requireRole("teacher");
  const store = getDataStore();

  const [courses, quizzes, subjects, users] = await Promise.all([
    store.getCourses({ includeUnpublished: true }),
    store.getQuizzes({ includeUnpublished: true }),
    store.getSubjects(),
    store.listUsers("student"),
  ]);

  const lessonsPerCourse = await Promise.all(
    courses.map((c) => store.getLessonsForCourse(c.id))
  );
  const totalLessons = lessonsPerCourse.reduce((s, l) => s + l.length, 0);

  return (
    <div className="bg-paper">
      <div className="wrap py-10">
        <p className="eyebrow">Teacher portal</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950">Teaching workspace</h1>
        <p className="mt-3 max-w-2xl text-base text-muted">
          Create and manage courses, lessons and quiz content. New courses are
          unpublished by default — an administrator publishes them.
        </p>

        {/* Stats */}
        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: BookOpen, label: "Courses", value: courses.length },
            { icon: GraduationCap, label: "Lessons", value: totalLessons },
            { icon: FileCheck2, label: "Quizzes", value: quizzes.length },
            { icon: Users, label: "Students", value: users.length },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <span className="grid size-9 place-items-center rounded-lg bg-navy-50 text-navy-800">
                <s.icon className="size-4.5" />
              </span>
              <dd className="mt-3 text-2xl font-bold text-navy-950">{s.value}</dd>
              <dt className="text-[13px] text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Course list */}
          <section className="card overflow-hidden" aria-labelledby="courses-heading">
            <div className="border-b border-line px-6 py-4">
              <h2 id="courses-heading" className="font-bold text-navy-950">Courses</h2>
            </div>
            <ul className="divide-y divide-line">
              {courses.map((course) => {
                const lessonCount = lessonsPerCourse[courses.indexOf(course)]?.length ?? 0;
                return (
                  <li key={course.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold text-navy-950">
                        {course.title}
                        {!course.published && (
                          <span className="badge-gold text-[11px]">Unpublished</span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {lessonCount} lessons · {course.level} · {course.isDemo ? "Demo" : "Teacher-authored"}
                      </p>
                    </div>
                    <Link href={`/courses/${course.slug}`} className="btn-secondary btn-sm shrink-0">
                      View course
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Creation forms */}
          <div className="space-y-6">
            <section className="card p-6" aria-labelledby="new-course-heading">
              <h2 id="new-course-heading" className="font-bold text-navy-950">Create a course</h2>
              <div className="mt-4">
                <CreateCourseForm subjects={subjects} />
              </div>
            </section>
            <section className="card p-6" aria-labelledby="new-lesson-heading">
              <h2 id="new-lesson-heading" className="font-bold text-navy-950">Add a lesson</h2>
              <div className="mt-4">
                <AddLessonForm courses={courses} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
