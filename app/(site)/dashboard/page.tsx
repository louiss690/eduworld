import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Bot,
  FileCheck2,
  Globe2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { getDataStore } from "@/services/data";
import { requireUser } from "@/services/auth/session";
import { buildStudentSummary } from "@/services/dashboard";
import { formatDurationMinutes } from "@/lib/utils";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalised EduWorld learning dashboard.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  const store = getDataStore();

  const [profile, countries, languages, levels, { summary, enrollments, recommended }] =
    await Promise.all([
      store.getStudentProfile(user.id),
      store.getCountries(),
      store.getLanguages(),
      store.getLevels(),
      buildStudentSummary(user.id, store),
    ]);

  const country = countries.find((c) => c.code === profile?.countryCode);
  const language = languages.find((l) => l.code === profile?.languageCode);
  const level = levels.find((l) => l.id === profile?.educationLevelId);

  const first = user.name.split(" ")[0];

  return (
    <div className="bg-paper">
      {/* Welcome */}
      <section className="border-b border-line bg-white">
        <div className="wrap flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-navy-950 text-xl font-bold text-white">
              {initials(user.name)}
            </span>
            <div>
              <p className="text-sm text-muted">Welcome back,</p>
              <h1 className="text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">{first} 👋</h1>
              <p className="mt-1 text-sm text-muted">
                {country ? `📍 ${country.name}` : "Wherever you are, keep learning."}
                {language?.available === false && ` · ${language.name} content coming soon`}
              </p>
            </div>
          </div>
          <Link href="/library" className="btn-primary shrink-0">
            Explore courses <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <div className="wrap grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* My Learning */}
          <section aria-labelledby="my-learning-heading">
            <div className="flex items-center justify-between">
              <h2 id="my-learning-heading" className="text-lg font-bold text-navy-950">My learning</h2>
              <Link href="/library" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                Find more
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
                <BookOpenCheck className="mx-auto size-10 text-navy-200" />
                <h3 className="mt-4 font-semibold text-navy-950">Start your first course</h3>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
                  Enroll in a course to see it here and start tracking progress.
                </p>
                <Link href="/library" className="btn-primary mt-5">Browse courses</Link>
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {enrollments.map(({ course, progressPct }) => (
                  <li key={course.id}>
                    <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                      <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-lg bg-navy-100 sm:block">
                        {course.imageUrl && (
                          <Image src={course.imageUrl} alt="" fill sizes="96px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                          {course.subjectId.replace("subj-", "").replace("-", " ")}
                        </p>
                        <Link href={`/courses/${course.slug}`} className="mt-0.5 block truncate font-semibold text-navy-950 hover:text-brand-700">
                          {course.title}
                        </Link>
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
                            <div
                              className="h-full rounded-full bg-brand-600 transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[13px] font-semibold tabular-nums text-navy-800">{progressPct}%</span>
                        </div>
                      </div>
                      <Link href={`/courses/${course.slug}/lessons/start`} className="btn-secondary btn-sm shrink-0">
                        Continue <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recommended */}
          {recommended.length > 0 && (
            <section aria-labelledby="recommended-heading">
              <h2 id="recommended-heading" className="text-lg font-bold text-navy-950">
                Recommended for you
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {recommended.map((course) => (
                  <li key={course.id}>
                    <Link href={`/courses/${course.slug}`} className="card flex gap-4 p-4 transition-shadow hover:shadow-md">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-navy-100">
                        {course.imageUrl && (
                          <Image src={course.imageUrl} alt="" fill sizes="64px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy-950">{course.title}</p>
                        <p className="mt-1 text-[13px] text-muted">
                          {course.instructor.name} · {course.level}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* AI Tutor quick access */}
          <div className="card overflow-hidden">
            <div className="bg-navy-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-white/10 text-brand-200">
                  <Bot className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">AI Tutor</p>
                  <p className="text-[13px] text-navy-300">Your personal study companion</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-navy-200">
                Stuck on a topic? Ask the tutor to explain it step by step, or
                generate practice questions for you.
              </p>
              <Link href="/tutor" className="btn-primary mt-5 w-full">
                <Sparkles className="size-4" /> Open AI Tutor
              </Link>
            </div>
          </div>

          {/* Learning overview */}
          <section className="card p-6" aria-labelledby="overview-heading">
            <h2 id="overview-heading" className="text-base font-bold text-navy-950">Learning overview</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-[13px] text-muted">Enrolled courses</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-950">{summary.enrolledCourses}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Completed lessons</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-950">{summary.completedLessons}</dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Average quiz score</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-950">
                  {summary.averageQuizScore === null ? "—" : `${summary.averageQuizScore}%`}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-muted">Quizzes taken</dt>
                <dd className="mt-1 text-2xl font-bold text-navy-950">{summary.quizzesTaken}</dd>
              </div>
            </dl>
          </section>

          {/* Achievements */}
          <section className="card p-6" aria-labelledby="achievements-heading">
            <div className="flex items-center justify-between">
              <h2 id="achievements-heading" className="text-base font-bold text-navy-950">Achievements</h2>
              <span className="badge">{summary.achievements.length} earned</span>
            </div>
            {summary.achievements.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {summary.achievements.map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-600">
                      <Award className="size-4.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-950">{a.name}</p>
                      <p className="truncate text-[13px] text-muted">{a.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Complete lessons and quizzes to earn your first badges.
              </p>
            )}
          </section>

          {/* Recent activity */}
          <section className="card p-6" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="text-base font-bold text-navy-950">Recent activity</h2>
            {summary.recentActivity.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {summary.recentActivity.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                      {a.type === "quiz" ? (
                        <FileCheck2 className="size-4" />
                      ) : a.type === "achievement" ? (
                        <Award className="size-4" />
                      ) : (
                        <Target className="size-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-950">{a.label} · {a.detail}</p>
                      <p className="text-[13px] text-muted">
                        {new Date(a.at).toLocaleDateString("en", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">Your recent activity will appear here.</p>
            )}
          </section>

          {/* Profile card */}
          <section className="card p-6" aria-labelledby="profile-heading">
            <div className="flex items-center justify-between">
              <h2 id="profile-heading" className="text-base font-bold text-navy-950">Profile</h2>
              <Link href="/settings" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                Settings
              </Link>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Globe2 className="size-4 text-muted" />
                <dt className="text-muted">Country</dt>
                <dd className="ml-auto font-medium text-navy-900">{country?.name ?? "—"}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-4 text-muted" />
                <dt className="text-muted">Level</dt>
                <dd className="ml-auto font-medium text-navy-900">{level?.name ?? "—"}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
