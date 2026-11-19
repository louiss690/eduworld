import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type {
  Achievement,
  AIConversation,
  AIMessage,
  Bookmark,
  BookmarkTarget,
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
import { demoCatalog } from "@/data/demo";
import type { DataStore } from "./types";

/**
 * LocalStore — the zero-configuration demo backend, persisted to a local
 * JSON file.
 *
 * Why a file? Next.js compiles server components and route handlers as
 * separate module graphs, so a purely in-memory store would have two
 * divergent instances (one per graph). Writing through to a single JSON
 * file on disk gives both contexts one consistent view, and survives dev
 * restarts. Writes are atomic (write-temp-then-rename) and synchronous,
 * which is fine at demo scale.
 *
 * Everything stored here is demo data, clearly labelled in the UI.
 */

interface LocalState {
  accounts: { email: string; user: User; passwordHash: string | null }[];
  studentProfiles: StudentProfile[];
  teacherProfiles: TeacherProfile[];
  enrollments: Enrollment[];
  progress: LearningProgress[];
  attempts: QuizAttempt[];
  conversations: AIConversation[];
  messages: AIMessage[];
  notifications: Notification[];
  userAchievements: UserAchievement[];
  reports: Report[];
  quizzes: Quiz[];
  courses: Course[];
  lessons: Lesson[];
  bookmarks: Bookmark[];
}

function emptyState(): LocalState {
  return {
    accounts: [],
    studentProfiles: [],
    teacherProfiles: [],
    enrollments: [],
    progress: [],
    attempts: [],
    conversations: [],
    messages: [],
    notifications: [],
    userAchievements: [],
    reports: [],
    quizzes: [],
    courses: [],
    lessons: [],
    bookmarks: [],
  };
}

function dataFile(): string {
  return join(process.cwd(), ".local-data", "db.json");
}

const BUILTIN_USERS: User[] = [
  {
    id: "user-admin",
    email: "admin@edu.world",
    name: "EduWorld Admin",
    role: "admin",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-teacher",
    email: "teacher@edu.world",
    name: "Grace Achebe",
    role: "teacher",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

class LocalStore implements DataStore {
  private state: LocalState;

  constructor() {
    this.state = this.load();
  }

  /**
   * Reloads state from disk. Called before every public operation so that
   * the multiple module graphs Next.js uses (RSC pages vs route handlers)
   * always see each other's writes.
   */
  freshen(): void {
    this.state = this.load();
  }

  private load(): LocalState {
    const file = dataFile();
    try {
      if (existsSync(file)) {
        const parsed = JSON.parse(readFileSync(file, "utf8")) as Partial<LocalState>;
        return { ...emptyState(), ...parsed };
      }
    } catch {
      // Corrupt or unreadable demo data → start fresh.
    }
    return emptyState();
  }

  private persist(): void {
    const file = dataFile();
    const dir = dirname(file);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const temp = `${file}.tmp`;
    writeFileSync(temp, JSON.stringify(this.state, null, 0), "utf8");
    renameSync(temp, file);
  }

  // ── Catalog (seed, immutable) ───────────────────────────────────────────
  async getCountries(): Promise<Country[]> {
    return demoCatalog.countries;
  }
  async getLanguages(): Promise<Language[]> {
    return demoCatalog.languages;
  }
  async getLevels(): Promise<EducationalLevel[]> {
    return demoCatalog.levels;
  }
  async getSubjects(): Promise<Subject[]> {
    return demoCatalog.subjects;
  }
  async getAchievements(): Promise<Achievement[]> {
    return demoCatalog.achievements;
  }

  private courseById(id: string): Course | undefined {
    return this.state.courses.find((c) => c.id === id);
  }
  private lessonById(id: string): Lesson | undefined {
    return this.state.lessons.find((l) => l.id === id);
  }

  async getCourses(options?: { includeUnpublished?: boolean }): Promise<Course[]> {
    const catalog = [...demoCatalog.courses, ...this.state.courses];
    return catalog.filter((c) => options?.includeUnpublished || c.published);
  }
  async getCourseBySlug(slug: string): Promise<Course | null> {
    const catalog = [...demoCatalog.courses, ...this.state.courses];
    return catalog.find((c) => c.slug === slug) ?? null;
  }
  async getCourseById(id: string): Promise<Course | null> {
    const catalog = [...demoCatalog.courses, ...this.state.courses];
    return catalog.find((c) => c.id === id) ?? null;
  }
  async getLessonsForCourse(courseId: string): Promise<Lesson[]> {
    const catalog = [...demoCatalog.lessons, ...this.state.lessons];
    return catalog.filter((l) => l.courseId === courseId).sort((a, b) => a.order - b.order);
  }
  async getLessonById(id: string): Promise<Lesson | null> {
    const catalog = [...demoCatalog.lessons, ...this.state.lessons];
    return catalog.find((l) => l.id === id) ?? null;
  }
  async getQuizzes(options?: { includeUnpublished?: boolean }): Promise<Quiz[]> {
    const all = [...demoCatalog.quizzes, ...this.state.quizzes];
    return all.filter((q) => options?.includeUnpublished || q.published);
  }
  async getQuizById(id: string): Promise<Quiz | null> {
    const all = [...demoCatalog.quizzes, ...this.state.quizzes];
    return all.find((q) => q.id === id) ?? null;
  }
  async getQuizForCourse(courseId: string): Promise<Quiz | null> {
    const all = [...demoCatalog.quizzes, ...this.state.quizzes];
    return all.find((q) => q.courseId === courseId && q.published) ?? null;
  }

  async createCourse(input: Omit<Course, "id" | "createdAt" | "isDemo" | "published"> & { published?: boolean }): Promise<Course> {
    const course: Course = {
      ...input,
      id: `course-${randomUUID().slice(0, 8)}`,
      slug: `${input.slug}-${Date.now().toString(36)}`,
      isDemo: false,
      published: input.published ?? false,
      createdAt: new Date().toISOString(),
    };
    this.state.courses.push(course);
    this.persist();
    return course;
  }
  async createLesson(input: Omit<Lesson, "id" | "courseId" | "order"> & { courseId: string; order: number }): Promise<Lesson> {
    const lesson: Lesson = {
      ...input,
      id: `lesson-${randomUUID().slice(0, 8)}`,
    };
    this.state.lessons.push(lesson);
    this.persist();
    return lesson;
  }

  // ── Users ─────────────────────────────────────────────────────────────
  async createUser(input: { email: string; name: string; role: "student" | "teacher"; passwordHash: string | null }): Promise<User> {
    const email = input.email.trim().toLowerCase();
    if (this.state.accounts.some((a) => a.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const user: User = {
      id: randomUUID(),
      email,
      name: input.name.trim(),
      role: input.role,
      createdAt: new Date().toISOString(),
    };
    this.state.accounts.push({ email, user, passwordHash: input.passwordHash });
    if (input.role === "student") {
      this.state.studentProfiles.push({
        userId: user.id,
        countryCode: null,
        languageCode: "en",
        educationLevelId: null,
        bio: null,
        subjectIds: [],
      });
    } else {
      this.state.teacherProfiles.push({ userId: user.id, bio: null, subjectIds: [] });
    }
    this.persist();
    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.state.accounts.find((a) => a.email === email.trim().toLowerCase())?.user ?? null;
  }
  async getUserById(id: string): Promise<User | null> {
    return this.state.accounts.find((a) => a.user.id === id)?.user ?? null;
  }
  async verifyCredentials?(email: string, password: string): Promise<User | null> {
    const account = this.state.accounts.find((a) => a.email === email.trim().toLowerCase());
    if (!account || !account.passwordHash) return null;
    const { verifyPassword } = await import("@/lib/password");
    return verifyPassword(password, account.passwordHash) ? account.user : null;
  }
  async setPassword?(email: string, passwordHash: string): Promise<void> {
    const account = this.state.accounts.find((a) => a.email === email.trim().toLowerCase());
    if (!account) throw new Error("No account found with that email.");
    account.passwordHash = passwordHash;
    this.persist();
  }
  async setStudentProfile(userId: string, profile: Partial<StudentProfile>): Promise<void> {
    const current = this.state.studentProfiles.find((p) => p.userId === userId) ?? {
      userId,
      countryCode: null,
      languageCode: "en",
      educationLevelId: null,
      bio: null,
      subjectIds: [],
    };
    const next: StudentProfile = {
      userId,
      countryCode: profile.countryCode ?? current.countryCode,
      languageCode: profile.languageCode ?? current.languageCode,
      educationLevelId: profile.educationLevelId ?? current.educationLevelId,
      bio: profile.bio ?? current.bio,
      subjectIds: Array.isArray(profile.subjectIds) ? profile.subjectIds : current.subjectIds,
    };
    const idx = this.state.studentProfiles.findIndex((p) => p.userId === userId);
    if (idx >= 0) this.state.studentProfiles[idx] = next;
    else this.state.studentProfiles.push(next);
    this.persist();
  }
  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    return this.state.studentProfiles.find((p) => p.userId === userId) ?? null;
  }
  async setTeacherProfile(userId: string, profile: Partial<TeacherProfile>): Promise<void> {
    const current = this.state.teacherProfiles.find((p) => p.userId === userId) ?? {
      userId,
      bio: null,
      subjectIds: [],
    };
    const next: TeacherProfile = {
      userId,
      bio: profile.bio ?? current.bio,
      subjectIds: profile.subjectIds ?? current.subjectIds,
    };
    const idx = this.state.teacherProfiles.findIndex((p) => p.userId === userId);
    if (idx >= 0) this.state.teacherProfiles[idx] = next;
    else this.state.teacherProfiles.push(next);
    this.persist();
  }
  async getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    return this.state.teacherProfiles.find((p) => p.userId === userId) ?? null;
  }
  async listUsers(role?: "student" | "teacher" | "admin"): Promise<User[]> {
    const all = [...BUILTIN_USERS, ...this.state.accounts.map((a) => a.user)];
    return role ? all.filter((u) => u.role === role) : all;
  }
  async updateUserRole(userId: string, role: User["role"]): Promise<void> {
    const account = this.state.accounts.find((a) => a.user.id === userId);
    if (account) {
      account.user.role = role;
      this.persist();
    }
  }
  async deleteUser(userId: string): Promise<void> {
    this.state.accounts = this.state.accounts.filter((a) => a.user.id !== userId);
    this.persist();
  }

  // ── Enrollments ───────────────────────────────────────────────────────
  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    if (!this.courseById(courseId) && !demoCatalog.courses.some((c) => c.id === courseId)) {
      throw new Error("Course not found.");
    }
    const existing = this.state.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) return existing;
    const enrollment: Enrollment = {
      id: randomUUID(),
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      progressPct: 0,
    };
    this.state.enrollments.push(enrollment);
    this.persist();
    return enrollment;
  }
  async unenroll(userId: string, courseId: string): Promise<void> {
    this.state.enrollments = this.state.enrollments.filter((e) => !(e.userId === userId && e.courseId === courseId));
    this.persist();
  }
  async getEnrollments(userId: string): Promise<Enrollment[]> {
    return this.state.enrollments
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt));
  }
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    return this.state.enrollments.some((e) => e.userId === userId && e.courseId === courseId);
  }

  // ── Progress ──────────────────────────────────────────────────────────
  async markLessonComplete(userId: string, courseId: string, lessonId: string): Promise<LearningProgress> {
    if (!this.lessonById(lessonId) && !demoCatalog.lessons.some((l) => l.id === lessonId)) {
      throw new Error("Lesson not found.");
    }
    const existing = this.state.progress.find((p) => p.userId === userId && p.lessonId === lessonId);
    if (existing) {
      existing.status = "completed";
      existing.updatedAt = new Date().toISOString();
      this.persist();
      return existing;
    }
    const record: LearningProgress = {
      id: randomUUID(),
      userId,
      courseId,
      lessonId,
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    this.state.progress.push(record);
    this.persist();
    return record;
  }
  async getProgressForUser(userId: string): Promise<LearningProgress[]> {
    return this.state.progress.filter((p) => p.userId === userId);
  }

  // ── Bookmarks ──────────────────────────────────────────────────────────
  async addBookmark(userId: string, targetType: BookmarkTarget, targetId: string): Promise<Bookmark> {
    const existing = this.state.bookmarks.find(
      (b) => b.userId === userId && b.targetType === targetType && b.targetId === targetId
    );
    if (existing) return existing;
    const bookmark: Bookmark = {
      id: randomUUID(),
      userId,
      targetType,
      targetId,
      createdAt: new Date().toISOString(),
    };
    this.state.bookmarks.push(bookmark);
    this.persist();
    return bookmark;
  }
  async removeBookmark(userId: string, targetType: BookmarkTarget, targetId: string): Promise<void> {
    this.state.bookmarks = this.state.bookmarks.filter(
      (b) => !(b.userId === userId && b.targetType === targetType && b.targetId === targetId)
    );
    this.persist();
  }
  async listBookmarks(userId: string): Promise<Bookmark[]> {
    return this.state.bookmarks
      .filter((b) => b.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async isBookmarked(userId: string, targetType: BookmarkTarget, targetId: string): Promise<boolean> {
    return this.state.bookmarks.some(
      (b) => b.userId === userId && b.targetType === targetType && b.targetId === targetId
    );
  }

  // ── Quizzes ───────────────────────────────────────────────────────────
  async saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    this.state.attempts.push(attempt);
    this.persist();
    return attempt;
  }
  async getAttemptsForUser(userId: string): Promise<QuizAttempt[]> {
    return this.state.attempts
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  }
  async createQuiz(quiz: Omit<Quiz, "id">): Promise<Quiz> {
    const created: Quiz = { ...quiz, id: randomUUID() };
    this.state.quizzes.push(created);
    this.persist();
    return created;
  }
  async updateQuiz(quiz: Quiz): Promise<void> {
    const idx = this.state.quizzes.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) {
      this.state.quizzes[idx] = quiz;
      this.persist();
    }
  }

  // ── AI conversations ──────────────────────────────────────────────────
  async createConversation(userId: string, title: string): Promise<AIConversation> {
    const now = new Date().toISOString();
    const conversation: AIConversation = { id: randomUUID(), userId, title, createdAt: now, updatedAt: now };
    this.state.conversations.push(conversation);
    this.persist();
    return conversation;
  }
  async listConversations(userId: string): Promise<AIConversation[]> {
    return this.state.conversations
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async getConversation(id: string): Promise<{ conversation: AIConversation; messages: AIMessage[] } | null> {
    const conversation = this.state.conversations.find((c) => c.id === id);
    if (!conversation) return null;
    return {
      conversation,
      messages: this.state.messages
        .filter((m) => m.conversationId === id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    };
  }
  async appendMessage(message: AIMessage): Promise<void> {
    this.state.messages.push(message);
    const conversation = this.state.conversations.find((c) => c.id === message.conversationId);
    if (conversation) conversation.updatedAt = new Date().toISOString();
    this.persist();
  }

  // ── Notifications / achievements / reports ────────────────────────────
  async addNotification(input: { userId: string; type: Notification["type"]; title: string; body?: string | null }): Promise<Notification> {
    const notification: Notification = {
      id: randomUUID(),
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      readAt: null,
      createdAt: new Date().toISOString(),
    };
    this.state.notifications.push(notification);
    this.persist();
    return notification;
  }
  async listNotifications(userId: string): Promise<Notification[]> {
    return this.state.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async markNotificationsRead(userId: string): Promise<void> {
    for (const n of this.state.notifications) {
      if (n.userId === userId && !n.readAt) n.readAt = new Date().toISOString();
    }
    this.persist();
  }
  async earnAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const existing = this.state.userAchievements.find((a) => a.userId === userId && a.achievementId === achievementId);
    if (existing) return existing;
    const earned: UserAchievement = {
      id: randomUUID(),
      userId,
      achievementId,
      earnedAt: new Date().toISOString(),
    };
    this.state.userAchievements.push(earned);
    this.persist();
    return earned;
  }
  async listUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.state.userAchievements.filter((a) => a.userId === userId);
  }
  async createReport(input: Omit<Report, "id" | "createdAt" | "status" | "resolvedAt">): Promise<Report> {
    const report: Report = {
      ...input,
      id: randomUUID(),
      status: "open",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    this.state.reports.push(report);
    this.persist();
    return report;
  }
  async listReports(status?: Report["status"]): Promise<Report[]> {
    const reports = status ? this.state.reports.filter((r) => r.status === status) : this.state.reports;
    return [...reports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async updateReportStatus(reportId: string, status: Report["status"]): Promise<void> {
    const report = this.state.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      report.resolvedAt = status === "open" ? null : new Date().toISOString();
      this.persist();
    }
  }
}

let singleton: DataStore | null = null;

export function getLocalStore(): DataStore {
  if (!singleton) {
    const raw = new LocalStore();
    singleton = new Proxy(raw, {
      get(target, prop) {
        const value = (target as unknown as Record<string, unknown>)[prop as string];
        if (typeof value === "function") {
          return (...args: unknown[]) => {
            target.freshen();
            return Reflect.apply(value, target, args);
          };
        }
        return value;
      },
    }) as DataStore;
  }
  return singleton;
}
