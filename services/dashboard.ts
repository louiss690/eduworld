import type {
  BookmarkTarget,
  Course,
  QuizAttempt,
  RecentActivity,
  StudentSummary,
} from "@/types";
import type { DataStore } from "@/services/data/types";

export interface ResolvedBookmark {
  targetType: BookmarkTarget;
  targetId: string;
  title: string;
  href: string;
  createdAt: string;
}

export interface DashboardBundle {
  summary: StudentSummary;
  enrollments: { course: Course; progressPct: number }[];
  recommended: Course[];
  recentLessons: { lessonId: string; title: string; courseId: string; courseSlug: string; courseTitle: string; at: string }[];
  recentAttempts: { attempt: QuizAttempt; quizTitle: string }[];
  bookmarks: ResolvedBookmark[];
  subjectProgress: { subjectName: string; done: number; total: number; pct: number }[];
}

async function resolveBookmark(
  store: DataStore,
  targetType: BookmarkTarget,
  targetId: string
): Promise<{ title: string; href: string } | null> {
  if (targetType === "course") {
    const course = await store.getCourseById(targetId);
    return course ? { title: course.title, href: `/courses/${course.slug}` } : null;
  }
  if (targetType === "lesson") {
    const lesson = await store.getLessonById(targetId);
    if (!lesson) return null;
    const course = await store.getCourseById(lesson.courseId);
    return {
      title: lesson.title,
      href: `/courses/${course?.slug ?? ""}/lessons/${lesson.id}`,
    };
  }
  return null;
}

export async function buildStudentSummary(
  userId: string,
  store: DataStore
): Promise<DashboardBundle> {
  const [enrollments, progress, attempts, achievements, userAchievements, courses, bookmarks] =
    await Promise.all([
      store.getEnrollments(userId),
      store.getProgressForUser(userId),
      store.getAttemptsForUser(userId),
      store.getAchievements(),
      store.listUserAchievements(userId),
      store.getCourses(),
      store.listBookmarks(userId),
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

  // Recently accessed lessons (most recent first).
  const recentLessons: DashboardBundle["recentLessons"] = [];
  for (const p of [...progress].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))) {
    const lesson = await store.getLessonById(p.lessonId);
    if (!lesson) continue;
    const course = await store.getCourseById(p.courseId);
    recentLessons.push({
      lessonId: lesson.id,
      title: lesson.title,
      courseId: p.courseId,
      courseSlug: course?.slug ?? "",
      courseTitle: course?.title ?? "",
      at: p.updatedAt,
    });
    if (recentLessons.length >= 5) break;
  }

  // Recent quiz attempts with quiz titles.
  const recentAttempts: DashboardBundle["recentAttempts"] = [];
  for (const attempt of attempts.slice(0, 5)) {
    const quiz = await store.getQuizById(attempt.quizId);
    recentAttempts.push({ attempt, quizTitle: quiz?.title ?? "Quiz" });
  }

  // Bookmarks resolved to readable titles/links.
  const resolvedBookmarks: ResolvedBookmark[] = [];
  for (const bookmark of bookmarks) {
    const resolved = await resolveBookmark(store, bookmark.targetType, bookmark.targetId);
    if (!resolved) continue;
    resolvedBookmarks.push({
      targetType: bookmark.targetType,
      targetId: bookmark.targetId,
      title: resolved.title,
      href: resolved.href,
      createdAt: bookmark.createdAt,
    });
    if (resolvedBookmarks.length >= 8) break;
  }

  // Real per-subject completion across enrolled courses.
  const subjects = await store.getSubjects();
  const subjectProgress: DashboardBundle["subjectProgress"] = [];
  for (const subject of subjects) {
    const subjectCourses = enriched.filter((e) => e.course.subjectId === subject.id);
    if (subjectCourses.length === 0) continue;
    let done = 0;
    let total = 0;
    for (const e of subjectCourses) {
      const lessons = await store.getLessonsForCourse(e.course.id);
      total += lessons.length;
      done += lessons.filter((l) => completedLessons.some((p) => p.lessonId === l.id)).length;
    }
    if (total === 0) continue;
    subjectProgress.push({
      subjectName: subject.name,
      done,
      total,
      pct: Math.round((done / total) * 100),
    });
  }
  subjectProgress.sort((a, b) => b.pct - a.pct);

  return { summary, enrollments: enriched, recommended, recentLessons, recentAttempts, bookmarks: resolvedBookmarks, subjectProgress };
}
