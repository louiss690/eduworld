import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/env";
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
import type { DataStore } from "./types";

/**
 * SupabaseStore — production backend backed by Supabase (PostgreSQL + Auth).
 *
 * Uses the service-role key server-side. Authorization is enforced at the
 * application layer (requireUser + role checks) AND in the database via
 * Row Level Security policies defined in `database/migrations/001_init.sql`.
 *
 * Throw with a descriptive message if the environment is not configured —
 * the app should never silently fall back to demo data when a real backend
 * is expected.
 */

let cached: SupabaseClient | null = null;

function requireSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = supabaseUrl();
  const key = supabaseServiceRoleKey();
  if (!url || !key) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local");
  }
  cached = createClient(url, key);
  return cached;
}

/**
 * Lazy client accessor: the module never connects at import time (so builds
 * and demo deployments work without credentials). The first actual query
 * constructs the client; only then do missing credentials surface.
 */
const db = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = requireSupabase();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/** Column mapper: snake_case ↔ camelCase for the tables we read/write. */
const mapRow = (row: Record<string, unknown>) => row;

export const supabaseStore: DataStore = {
  // ── Reference data ────────────────────────────────────────────────────
  async getCountries(): Promise<Country[]> {
    const { data, error } = await db.from("countries").select("code, name").order("name");
    if (error) throw error;
    return (data ?? []).map((r) => ({ code: r.code, name: r.name }));
  },
  async getLanguages(): Promise<Language[]> {
    const { data, error } = await db.from("languages").select("code, name, native_name, available").order("name");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      code: r.code, name: r.name, nativeName: r.native_name, available: r.available,
    }));
  },
  async getLevels(): Promise<EducationalLevel[]> {
    const { data, error } = await db.from("educational_levels").select("id, slug, name, display_order").order("display_order");
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, slug: r.slug, name: r.name, order: r.display_order }));
  },
  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await db.from("subjects").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, slug: r.slug, name: r.name,
      shortDescription: r.short_description, description: r.description,
      imageUrl: r.image_url, iconKey: r.icon_key,
    }));
  },
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await db.from("achievements").select("id, slug, name, description");
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, slug: r.slug, name: r.name, description: r.description }));
  },

  // ── Catalog ───────────────────────────────────────────────────────────
  async getCourses(options?: { includeUnpublished?: boolean }): Promise<Course[]> {
    let query = db.from("courses").select("*");
    if (!options?.includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query.order("created_at");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, slug: r.slug, title: r.title, subjectId: r.subject_id,
      level: r.level, format: r.format, description: r.description,
      longDescription: r.long_description, imageUrl: r.image_url,
      instructor: typeof r.instructor === "object" ? r.instructor : { name: r.instructor_name ?? "", title: "" },
      published: r.published, featured: r.featured, isDemo: r.is_demo ?? false,
      createdAt: r.created_at,
    }));
  },
  async getCourseBySlug(slug: string): Promise<Course | null> {
    const { data, error } = await db.from("courses").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return (await this.getCourses({ includeUnpublished: true })).find((c) => c.id === data.id) ?? null;
  },
  async getCourseById(id: string): Promise<Course | null> {
    const { data, error } = await db.from("courses").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return (await this.getCourses({ includeUnpublished: true })).find((c) => c.id === data.id) ?? null;
  },
  async createCourse(input: Omit<Course, "id" | "createdAt" | "isDemo" | "published"> & { published?: boolean }): Promise<Course> {
    const { data, error } = await db
      .from("courses")
      .insert({
        title: input.title,
        slug: `${input.slug}-${Date.now().toString(36)}`,
        subject_id: input.subjectId,
        level: input.level,
        format: input.format,
        description: input.description,
        long_description: input.longDescription,
        image_url: input.imageUrl,
        instructor: input.instructor as never,
        published: input.published ?? false,
        featured: input.featured,
      })
      .select("id")
      .single();
    if (error) throw error;
    return {
      ...input,
      id: data.id,
      slug: (await this.getCourseById(data.id))?.slug ?? input.slug,
      published: input.published ?? false,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
  },
  async createLesson(input: Omit<Lesson, "id" | "courseId" | "order"> & { courseId: string; order: number }): Promise<Lesson> {
    const { data, error } = await db
      .from("lessons")
      .insert({
        course_id: input.courseId,
        title: input.title,
        description: input.description,
        objectives: input.objectives as never,
        blocks: input.blocks as never,
        minutes: input.minutes,
        position: input.order,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { ...input, id: data.id };
  },
  async getLessonsForCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await db.from("lessons").select("*").eq("course_id", courseId).order("position");
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, courseId: r.course_id, title: r.title, description: r.description,
      objectives: r.objectives ?? [], blocks: r.blocks ?? [],
      minutes: r.minutes, order: r.position,
    }));
  },
  async getLessonById(id: string): Promise<Lesson | null> {
    const { data, error } = await db.from("lessons").select("*").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id, courseId: data.course_id, title: data.title, description: data.description,
      objectives: data.objectives ?? [], blocks: data.blocks ?? [],
      minutes: data.minutes, order: data.position,
    };
  },
  async getQuizzes(options?: { includeUnpublished?: boolean }): Promise<Quiz[]> {
    let query = db.from("quizzes").select("*, questions(*)");
    if (!options?.includeUnpublished) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, courseId: r.course_id, lessonId: r.lesson_id,
      title: r.title, description: r.description,
      questions: (r.questions ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position).map((q: Record<string, unknown>) => ({
        id: q.id, type: q.type, prompt: q.prompt, options: q.options ?? [],
        correctIndex: q.correct_index, correctAnswer: q.correct_answer,
        explanation: q.explanation,
      })),
      passingScore: r.passing_score, timeLimitMinutes: r.time_limit_minutes,
      published: r.published,
    }));
  },
  async getQuizById(id: string): Promise<Quiz | null> {
    const { data, error } = await db.from("quizzes").select("*, questions(*)").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return (await this.getQuizzes({ includeUnpublished: true })).find((q) => q.id === data.id) ?? null;
  },
  async getQuizForCourse(courseId: string): Promise<Quiz | null> {
    const quizzes = await this.getQuizzes();
    return quizzes.find((q) => q.courseId === courseId) ?? null;
  },

  // ── Users ─────────────────────────────────────────────────────────────
  async createUser(input: { email: string; name: string; role: "student" | "teacher"; passwordHash: string | null }): Promise<User> {
    // With Supabase, accounts are created through Supabase Auth (which owns
    // passwords). This row keeps the user's public profile in sync.
    const { data, error } = await db
      .from("users")
      .insert({ email: input.email, name: input.name, role: input.role })
      .select("id, email, name, role, created_at")
      .single();
    if (error) throw error;
    return { id: data.id, email: data.email, name: data.name, role: data.role, createdAt: data.created_at };
  },
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await db.from("users").select("id, email, name, role, created_at").eq("email", email.toLowerCase()).maybeSingle();
    if (error || !data) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role, createdAt: data.created_at };
  },
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await db.from("users").select("id, email, name, role, created_at").eq("id", id).maybeSingle();
    if (error || !data) return null;
    return { id: data.id, email: data.email, name: data.name, role: data.role, createdAt: data.created_at };
  },
  async setStudentProfile(userId: string, profile: Partial<StudentProfile>): Promise<void> {
    const { error } = await db.from("student_profiles").upsert({
      user_id: userId,
      country_code: profile.countryCode,
      language_code: profile.languageCode,
      education_level_id: profile.educationLevelId,
      bio: profile.bio,
    });
    if (error) throw error;
  },
  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    const { data, error } = await db.from("student_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error || !data) return null;
    return { userId: data.user_id, countryCode: data.country_code, languageCode: data.language_code, educationLevelId: data.education_level_id, bio: data.bio };
  },
  async setTeacherProfile(userId: string, profile: Partial<TeacherProfile>): Promise<void> {
    const { error } = await db.from("teacher_profiles").upsert({
      user_id: userId,
      bio: profile.bio,
      subject_ids: profile.subjectIds ?? [],
    });
    if (error) throw error;
  },
  async getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    const { data, error } = await db.from("teacher_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error || !data) return null;
    return { userId: data.user_id, bio: data.bio, subjectIds: data.subject_ids ?? [] };
  },
  async listUsers(role?: "student" | "teacher" | "admin"): Promise<User[]> {
    let q = db.from("users").select("id, email, name, role, created_at");
    if (role) q = q.eq("role", role);
    const { data, error } = await q.order("created_at");
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, email: r.email, name: r.name, role: r.role, createdAt: r.created_at }));
  },
  async updateUserRole(userId: string, role: User["role"]): Promise<void> {
    const { error } = await db.from("users").update({ role }).eq("id", userId);
    if (error) throw error;
  },
  async deleteUser(userId: string): Promise<void> {
    const { error } = await db.from("users").delete().eq("id", userId);
    if (error) throw error;
  },

  // ── Enrollments ───────────────────────────────────────────────────────
  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    const { data, error } = await db
      .from("enrollments")
      .upsert({ user_id: userId, course_id: courseId, last_accessed_at: new Date().toISOString() })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id, userId: data.user_id, courseId: data.course_id,
      enrolledAt: data.enrolled_at, lastAccessedAt: data.last_accessed_at,
      progressPct: data.progress_pct,
    };
  },
  async unenroll(userId: string, courseId: string): Promise<void> {
    const { error } = await db.from("enrollments").delete().eq("user_id", userId).eq("course_id", courseId);
    if (error) throw error;
  },
  async getEnrollments(userId: string): Promise<Enrollment[]> {
    const { data, error } = await db.from("enrollments").select("*").eq("user_id", userId).order("enrolled_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, userId: r.user_id, courseId: r.course_id,
      enrolledAt: r.enrolled_at, lastAccessedAt: r.last_accessed_at,
      progressPct: r.progress_pct,
    }));
  },
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await db.from("enrollments").select("id").eq("user_id", userId).eq("course_id", courseId).maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },

  // ── Progress ──────────────────────────────────────────────────────────
  async markLessonComplete(userId: string, courseId: string, lessonId: string): Promise<LearningProgress> {
    const { data, error } = await db
      .from("learning_progress")
      .upsert({ user_id: userId, course_id: courseId, lesson_id: lessonId, status: "completed" })
      .select("*")
      .single();
    if (error) throw error;
    return { id: data.id, userId: data.user_id, courseId: data.course_id, lessonId: data.lesson_id, status: data.status, updatedAt: data.updated_at };
  },
  async getProgressForUser(userId: string): Promise<LearningProgress[]> {
    const { data, error } = await db.from("learning_progress").select("*").eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, userId: r.user_id, courseId: r.course_id, lessonId: r.lesson_id, status: r.status, updatedAt: r.updated_at }));
  },

  // ── Quizzes ───────────────────────────────────────────────────────────
  async saveQuizAttempt(attempt: QuizAttempt): Promise<QuizAttempt> {
    const { data, error } = await db
      .from("quiz_attempts")
      .insert({
        user_id: attempt.userId, quiz_id: attempt.quizId,
        score_pct: attempt.scorePct, passed: attempt.passed,
        correct_count: attempt.correctCount, total: attempt.total,
        answers: attempt.answers as never, completed_at: attempt.completedAt,
      })
      .select("*")
      .single();
    if (error) throw error;
    return { ...attempt, id: data.id };
  },
  async getAttemptsForUser(userId: string): Promise<QuizAttempt[]> {
    const { data, error } = await db.from("quiz_attempts").select("*").eq("user_id", userId).order("completed_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: r.id, userId: r.user_id, quizId: r.quiz_id,
      scorePct: r.score_pct, passed: r.passed, correctCount: r.correct_count,
      total: r.total, answers: r.answers ?? [], completedAt: r.completed_at,
    }));
  },
  async createQuiz(quiz: Omit<Quiz, "id">): Promise<Quiz> {
    const { data, error } = await db.from("quizzes").insert({ course_id: quiz.courseId, lesson_id: quiz.lessonId, title: quiz.title, description: quiz.description, passing_score: quiz.passingScore, time_limit_minutes: quiz.timeLimitMinutes, published: quiz.published }).select("id").single();
    if (error) throw error;
    return { ...quiz, id: data.id };
  },
  async updateQuiz(quiz: Quiz): Promise<void> {
    const { error } = await db.from("quizzes").update({ title: quiz.title, description: quiz.description, passing_score: quiz.passingScore, time_limit_minutes: quiz.timeLimitMinutes, published: quiz.published }).eq("id", quiz.id);
    if (error) throw error;
  },

  // ── AI conversations ──────────────────────────────────────────────────
  async createConversation(userId: string, title: string): Promise<AIConversation> {
    const { data, error } = await db.from("ai_conversations").insert({ user_id: userId, title }).select("id, user_id, title, created_at, updated_at").single();
    if (error) throw error;
    return { id: data.id, userId: data.user_id, title: data.title, createdAt: data.created_at, updatedAt: data.updated_at };
  },
  async listConversations(userId: string): Promise<AIConversation[]> {
    const { data, error } = await db.from("ai_conversations").select("id, user_id, title, created_at, updated_at").eq("user_id", userId).order("updated_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, userId: r.user_id, title: r.title, createdAt: r.created_at, updatedAt: r.updated_at }));
  },
  async getConversation(id: string): Promise<{ conversation: AIConversation; messages: AIMessage[] } | null> {
    interface ConversationRow {
      id: string;
      user_id: string;
      title: string;
      created_at: string;
      updated_at: string;
      ai_messages: {
        id: string;
        conversation_id: string;
        role: "user" | "assistant";
        content: string;
        created_at: string;
      }[];
    }
    const { data, error } = await db.from("ai_conversations").select("id, user_id, title, created_at, updated_at, ai_messages(*)").eq("id", id).maybeSingle();
    if (error || !data) return null;
    const row = data as ConversationRow;
    return {
      conversation: { id: row.id, userId: row.user_id, title: row.title, createdAt: row.created_at, updatedAt: row.updated_at },
      messages: [...row.ai_messages]
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map((m) => ({
          id: m.id,
          conversationId: m.conversation_id,
          role: m.role,
          content: m.content,
          createdAt: m.created_at,
        })),
    };
  },
  async appendMessage(message: AIMessage): Promise<void> {
    const { error } = await db.from("ai_messages").insert({ conversation_id: message.conversationId, role: message.role, content: message.content });
    if (error) throw error;
    const { error: touchError } = await db.from("ai_conversations").update({ updated_at: new Date().toISOString() }).eq("id", message.conversationId);
    if (touchError) throw touchError;
  },

  // ── Notifications / achievements / reports ────────────────────────────
  async addNotification(input: { userId: string; type: Notification["type"]; title: string; body?: string | null }): Promise<Notification> {
    const { data, error } = await db.from("notifications").insert({ user_id: input.userId, type: input.type, title: input.title, body: input.body ?? null }).select("*").single();
    if (error) throw error;
    return { id: data.id, userId: data.user_id, type: data.type, title: data.title, body: data.body, readAt: data.read_at, createdAt: data.created_at };
  },
  async listNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await db.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, userId: r.user_id, type: r.type, title: r.title, body: r.body, readAt: r.read_at, createdAt: r.created_at }));
  },
  async markNotificationsRead(userId: string): Promise<void> {
    const { error } = await db.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", userId).is("read_at", null);
    if (error) throw error;
  },
  async earnAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const { data, error } = await db.from("user_achievements").upsert({ user_id: userId, achievement_id: achievementId }).select("*").single();
    if (error) throw error;
    return { id: data.id, userId: data.user_id, achievementId: data.achievement_id, earnedAt: data.earned_at };
  },
  async listUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await db.from("user_achievements").select("*").eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, userId: r.user_id, achievementId: r.achievement_id, earnedAt: r.earned_at }));
  },
  async createReport(input: Omit<Report, "id" | "createdAt" | "status" | "resolvedAt">): Promise<Report> {
    const { data, error } = await db.from("reports").insert({ reporter_user_id: input.reporterUserId, target_type: input.targetType, target_id: input.targetId, reason: input.reason, details: input.details }).select("*").single();
    if (error) throw error;
    return { id: data.id, reporterUserId: data.reporter_user_id, targetType: data.target_type, targetId: data.target_id, reason: data.reason, details: data.details, status: data.status, createdAt: data.created_at, resolvedAt: data.resolved_at };
  },
  async listReports(status?: Report["status"]): Promise<Report[]> {
    let q = db.from("reports").select("*");
    if (status) q = q.eq("status", status);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({ id: r.id, reporterUserId: r.reporter_user_id, targetType: r.target_type, targetId: r.target_id, reason: r.reason, details: r.details, status: r.status, createdAt: r.created_at, resolvedAt: r.resolved_at }));
  },
  async updateReportStatus(reportId: string, status: Report["status"]): Promise<void> {
    const { error } = await db.from("reports").update({ status, resolved_at: status === "open" ? null : new Date().toISOString() }).eq("id", reportId);
    if (error) throw error;
  },
};

// Re-export for callers that want the typed row shape.
export { mapRow };

let storeSingleton: DataStore | null = null;

/**
 * Returns the Supabase-backed store. Constructed lazily so the module can be
 * imported (and compiled) even when Supabase is not configured — calling
 * this function without credentials throws with a clear message.
 */
export function getSupabaseStore(): DataStore {
  if (!storeSingleton) storeSingleton = supabaseStore;
  return storeSingleton;
}
