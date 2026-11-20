import { redirect } from "next/navigation";
import { getDataStore } from "@/services/data";
import { getCurrentUser } from "@/services/auth/session";

export const dynamic = "force-dynamic";

interface StartParams {
  slug: string;
}

/**
 * /courses/:slug/lessons/start, resumes the first incomplete lesson,
 * or starts the course from lesson one.
 */
export default async function StartLessonPage({ params }: { params: Promise<StartParams> }) {
  const { slug } = await params;
  const store = getDataStore();
  const course = await store.getCourseBySlug(slug);
  if (!course) redirect("/library");

  const lessons = await store.getLessonsForCourse(course.id);
  if (lessons.length === 0) redirect(`/courses/${slug}`);

  const user = await getCurrentUser();
  let target = lessons[0]!;
  if (user) {
    const progress = await store.getProgressForUser(user.id);
    const completed = new Set(
      progress.filter((p) => p.courseId === course.id && p.status === "completed").map((p) => p.lessonId)
    );
    target = lessons.find((l) => !completed.has(l.id)) ?? lessons[0]!;
  }

  redirect(`/courses/${slug}/lessons/${target.id}`);
}
