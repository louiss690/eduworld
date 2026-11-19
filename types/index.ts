/**
 * EduWorld domain types.
 * These mirror the relational schema in `database/migrations/001_init.sql`.
 */

export type Role = "student" | "teacher" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** ISO timestamp */
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  countryCode: string | null;
  languageCode: string | null;
  educationLevelId: string | null;
  bio: string | null;
}

export interface TeacherProfile {
  userId: string;
  bio: string | null;
  subjectIds: string[];
}

export interface Country {
  code: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  available: boolean;
}

export interface EducationalLevel {
  id: string;
  slug: string;
  name: string;
  order: number;
}

export interface Subject {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  iconKey: string;
}

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Instructor {
  name: string;
  title: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subjectId: string;
  level: CourseLevel;
  format: "course" | "subject";
  description: string;
  longDescription: string;
  imageUrl: string | null;
  instructor: Instructor;
  published: boolean;
  featured: boolean;
  /** true for demonstration content shipped with the platform */
  isDemo: boolean;
  createdAt: string;
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "callout"; tone: "info" | "tip" | "warning"; text: string }
  | { type: "example"; title: string; text: string }
  | { type: "exercise"; prompt: string; hint?: string };

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  objectives: string[];
  blocks: ContentBlock[];
  /** estimated minutes */
  minutes: number;
  order: number;
}

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  /** options for multiple_choice / true_false */
  options: string[];
  /** index of correct option (internal — never sent to the client) */
  correctIndex: number;
  /** accepted answer for short_answer (internal — case-insensitive match) */
  correctAnswer: string | null;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimitMinutes: number | null;
  published: boolean;
}

export interface QuizAnswer {
  questionId: string;
  /** selected option index for choice questions, text for short_answer */
  given: string | number;
}

export interface GradedQuestion extends QuizAnswer {
  correct: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  scorePct: number;
  passed: boolean;
  correctCount: number;
  total: number;
  answers: GradedQuestion[];
  completedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  /** 0-100 — derived from completed lessons */
  progressPct: number;
}

export type ProgressStatus = "in_progress" | "completed";

export interface LearningProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  status: ProgressStatus;
  updatedAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type AIMessageRole = "user" | "assistant";

export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
}

export type NotificationType =
  | "enrollment"
  | "quiz_result"
  | "achievement"
  | "course_update"
  | "security";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
}

export type ReportStatus = "open" | "resolved" | "dismissed";
export type ReportTarget = "course" | "lesson" | "quiz" | "ai_message" | "user";

export interface Report {
  id: string;
  reporterUserId: string;
  targetType: ReportTarget;
  targetId: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
}

/** Aggregate data returned for dashboards. */
export interface StudentSummary {
  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  totalLessons: number;
  averageQuizScore: number | null;
  quizzesTaken: number;
  achievements: Achievement[];
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  type: "lesson_completed" | "enrollment" | "quiz" | "achievement";
  label: string;
  detail: string;
  at: string;
}

export interface LibraryFilters {
  query?: string;
  subjectId?: string;
  level?: CourseLevel;
  countryCode?: string;
  languageCode?: string;
}

export interface LibraryResult {
  courses: Course[];
  subjects: Subject[];
  countries: Country[];
  languages: Language[];
  levels: EducationalLevel[];
}
