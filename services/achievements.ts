import { getDataStore } from "@/services/data";
import type { DataStore } from "@/services/data/types";

/**
 * Evaluates which achievements a user has newly earned and awards them.
 * Called after learning events (lesson completion, quiz submission).
 */
export async function evaluateAchievements(userId: string, store: DataStore = getDataStore()) {
  const [all, earned, progress, attempts] = await Promise.all([
    store.getAchievements(),
    store.listUserAchievements(userId),
    store.getProgressForUser(userId),
    store.getAttemptsForUser(userId),
  ]);

  const earnedIds = new Set(earned.map((e) => e.achievementId));
  const newlyEarned: string[] = [];

  async function award(slug: string) {
    const achievement = all.find((a) => a.slug === slug);
    if (achievement && !earnedIds.has(achievement.id)) {
      await store.earnAchievement(userId, achievement.id);
      earnedIds.add(achievement.id);
      newlyEarned.push(achievement.slug);
      await store.addNotification({
        userId,
        type: "achievement",
        title: `Achievement unlocked: ${achievement.name}`,
        body: achievement.description,
      });
    }
  }

  const completedLessons = progress.filter((p) => p.status === "completed");
  if (completedLessons.length >= 1) await award("first-lesson");
  if (completedLessons.length >= 10) await award("ten-lessons");
  if (attempts.length >= 1) await award("first-quiz");
  if (attempts.some((a) => a.scorePct >= 90)) await award("quiz-ace");

  // Course Conqueror: any course with all its lessons completed.
  const courses = await store.getCourses();
  for (const course of courses) {
    const lessons = await store.getLessonsForCourse(course.id);
    if (lessons.length === 0) continue;
    const done = lessons.filter(
      (l) => completedLessons.some((p) => p.lessonId === l.id)
    ).length;
    if (done >= lessons.length) {
      await award("course-complete");
      break;
    }
  }

  return newlyEarned;
}
