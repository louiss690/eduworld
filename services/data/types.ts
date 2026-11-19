import type {
  Achievement,
  AIConversation,
  AIMessage,
  Course,
  Country,
  EducationalLevel,
  Enrollment,
  Language,
  LearningProgress,
  Lesson,
  Notification,
  Quiz,
  QuizAttempt,
  Report,
  StudentProfile,
  Subject,
  TeacherProfile,
  User,
  UserAchievement,
} from "@/types";

export interface PublicQuestion {
  id: string;
  type: string;
  prompt: string;
  options: string[];
}

/**
 * Data store contract. EduWorld ships with two implementations:
 *  - LocalStore    — in-memory demo data (default, zero-config)
 *  - SupabaseStore — production backend backed by Supabase/PostgreSQL
 * Both expose the same interface, so page and API code is store-agnostic.
 */
export interface DataStore {
  // ── Reference data ─────────────────────────────────────────────────────
  getCountries(): Promise<Country[]>;
  getLanguages(): Promise<Language[]>;
  getLevels(): Promise<EducationalLevel[]>;
  getSubjects(): Promise<Subject[]>;
  getAchievements(): Promise<Achievement[]>;

  // ── Catalog ────────────────────────────────────────────────────────────
  getCourses(options?: { includeUnpublished?: boolean }): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | null>;
  getCourseById(id: string): Promise<Course | null>;
  /** Teacher-authored course creation (published defaults to false). */
  createCourse(input: Omit<Course, "id" | "createdAt" | "isDemo" | "published"> & { published?: boolean }): Promise<Course>;
  createLesson(input: Omit<Lesson, "id" | "courseId" | "order"> & { courseId: string; order: number }): Promise<Lesson>;
  getLessonsForCourse(courseId: string): Promise<Lesson[]>;
  getLessonById(id: string): Promise<Lesson | null>;
  getQuizzes(options?: { includeUnpublished?: boolean }): Promise<Quiz[]>;
  getQuizById(id: string): Promise<Quiz | null>;
  getQuizForCourse(courseId: string): Promise<Quiz | null>;

  // ── Users ──────────────────────────────────────────────────────────────
  createUser(input: {
    email: string;
    name: string;
    role: "student" | "teacher";
    passwordHash: string | null;
  }): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  /**
   * Demo-mode credential check (LocalStore only). Returns the user when the
   * password matches the stored hash. Supabase deployments never use this —
   * Supabase Auth handles password verification.
   */
  verifyCredentials?(email: string, password: string): Promise<User | null>;
  /** Demo-mode password reset (LocalStore only). */
  setPassword?(email: string, passwordHash: string): Promise<void>;
  setStudentProfile(userId: string, profile: Partial<StudentProfile>): Promise<void>;
  getStudentProfile(userId: string): Promise<StudentProfile | null>;
  setTeacherProfile(userId: string, profile: Partial<TeacherProfile>): Promise<void>;
  getTeacherProfile(userId: string): Promise<TeacherProfile | null>;
  listUsers(role?: "student" | "teacher" | "admin"): Promise<User[]>;
  updateUserRole(userId: string, role: User["role"]): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // ── Enrollments ────────────────────────────────────────────────────────
  enroll(userId: string, courseId: string): Promise<Enrollment>;
  unenroll(userId: string, courseId: string): Promise<void>;
  getEnrollments(userId: string): Promise<Enrollment[]>;
  isEnrolled(userId: string, courseId: string): Promise<boolean>;

  // ── Learning progress ──────────────────────────────────────────────────
  markLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string
  ): Promise<LearningProgress>;
  getProgressForUser(userId: string): Promise<LearningProgress[]>;

  // ── Quizzes ────────────────────────────────────────────────────────────
  saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt>;
  getAttemptsForUser(userId: string): Promise<QuizAttempt[]>;
  createQuiz(quiz: Omit<Quiz, "id">): Promise<Quiz>;
  updateQuiz(quiz: Quiz): Promise<void>;

  // ── AI tutor conversations ─────────────────────────────────────────────
  createConversation(userId: string, title: string): Promise<AIConversation>;
  listConversations(userId: string): Promise<AIConversation[]>;
  getConversation(id: string): Promise<{ conversation: AIConversation; messages: AIMessage[] } | null>;
  appendMessage(message: AIMessage): Promise<void>;

  // ── Notifications, achievements, reports ───────────────────────────────
  addNotification(input: {
    userId: string;
    type: Notification["type"];
    title: string;
    body?: string | null;
  }): Promise<Notification>;
  listNotifications(userId: string): Promise<Notification[]>;
  markNotificationsRead(userId: string): Promise<void>;
  earnAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  listUserAchievements(userId: string): Promise<UserAchievement[]>;
  createReport(input: Omit<Report, "id" | "createdAt" | "status" | "resolvedAt">): Promise<Report>;
  listReports(status?: Report["status"]): Promise<Report[]>;
  updateReportStatus(reportId: string, status: Report["status"]): Promise<void>;
}

/** Question shape for the client (never contains correct answers). */
export function toPublicQuestion(q: Quiz["questions"][number]): PublicQuestion {
  return { id: q.id, type: q.type, prompt: q.prompt, options: q.options };
}
