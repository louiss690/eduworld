import type { Course, RecentActivity, StudentSummary } from "@/types";
import type { DataStore } from "@/services/data/types";

/**
 * Assembles the personalised dashboard data for a student — derives stats,
 * recent activity and recommendation candidates from the store.
 */
export async function buildStudentSummary(
  userId: string,
  store: DataStore
): Promise<{ summary: StudentSummary; enrollments: { course: Course; progressPct: number }[]; recommended: Course[] }> {
  const [enrollments, progress, attempts, achievements, userAchievements, courses] =
    await Promise.all([
      store.getEnrollments(userId),
      store.getProgressForUser(userId),
      store.getAttemptsForUser(userId),
      store.getAchievements(),
      store.listUserAchievements(userId),
      store.getCourses(),
    ]);

  const completedLessons = progress.filter((p) => p.status === "completed");

  // Enrollments enriched with course + progress.
  const enriched: { course: Course; progressPct: number }[] = [];
  for (const enrollment of enrollments) {
    const course = await store.getCourseById(enrollment.courseId);
    if (!course) continue;
    const lessons = await store.getLessonsForCourse(course.id);
    const done = lessons.filter((l) =>
      completedLessons.some((p) => p.lessonId === l.id)
    ).length;
    const pct = lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100);
    enriched.push({ course, progressPct: pct });
  }

  const completedCourses = enriched.filter((e) => e.progressPct === 100).length;
  const totalLessonsCount = (
    await Promise.all(enriched.map((e) => store.getLessonsForCourse(e.course.id)))
  ).reduce((sum, lessons) => sum + lessons.length, 0);

  const averageQuizScore =
    attempts.length === 0
      ? null
      : Math.round(attempts.reduce((sum, a) => sum + a.scorePct, 0) / attempts.length);

  const earnedIds = new Set(userAchievements.map((a) => a.achievementId));
  const earnedAchievements = achievements.filter((a) => earnedIds.has(a.id));

  // Recent activity, most recent first.
  const activity: RecentActivity[] = [];
  for (const enrollment of enrollments) {
    activity.push({
      type: "enrollment",
      label: "Enrolled",
      detail: `Started a new course: ${enriched.find((e) => e.course.id === enrollment.courseId)?.course.title ?? ""}`,
      at: enrollment.enrolledAt,
    });
  }
  for (const p of completedLessons) {
    const lesson = await store.getLessonById(p.lessonId);
    if (!lesson) continue;
    const course = enriched.find((e) => e.course.id === p.courseId)?.course;
    activity.push({
      type: "lesson_completed",
      label: "Lesson completed",
      detail: `${lesson.title}${course ? ` · ${course.title}` : ""}`,
      at: p.updatedAt,
    });
  }
  for (const attempt of attempts) {
    const quiz = await store.getQuizById(attempt.quizId);
    activity.push({
      type: "quiz",
      label: "Quiz",
      detail: `${quiz?.title ?? "Quiz"}: ${attempt.scorePct}%`,
      at: attempt.completedAt,
    });
  }
  for (const a of userAchievements) {
    const ach = achievements.find((x) => x.id === a.achievementId);
    if (!ach) continue;
    activity.push({
      type: "achievement",
      label: "Achievement unlocked",
      detail: ach.name,
      at: a.earnedAt,
    });
  }
  activity.sort((a, b) => b.at.localeCompare(a.at));

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));
  const recommended = courses.filter((c) => !enrolledIds.has(c.id)).slice(0, 3);

  const summary: StudentSummary = {
    enrolledCourses: enrollments.length,
    completedCourses,
    completedLessons: completedLessons.length,
    totalLessons: totalLessonsCount,
    averageQuizScore,
    quizzesTaken: attempts.length,
    achievements: earnedAchievements,
    recentActivity: activity.slice(0, 8),
  };

  return { summary, enrollments: enriched, recommended };
}
