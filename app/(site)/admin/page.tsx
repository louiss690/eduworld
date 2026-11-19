import type { Metadata } from "next";
import { BookOpen, FileCheck2, Flag, GraduationCap, Users } from "lucide-react";
import { ReportsTable, UsersTable } from "@/components/admin/AdminTables";
import { getDataStore } from "@/services/data";
import { requireRole } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Admin dashboard",
  description: "Platform administration for EduWorld.",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireRole("admin");
  const store = getDataStore();

  const [students, teachers, admins, courses, quizzes, reports] = await Promise.all([
    store.listUsers("student"),
    store.listUsers("teacher"),
    store.listUsers("admin"),
    store.getCourses({ includeUnpublished: true }),
    store.getQuizzes({ includeUnpublished: true }),
    store.listReports(),
  ]);

  const openReports = reports.filter((r) => r.status === "open");
  const allUsers = [...admins, ...teachers, ...students];

  return (
    <div className="bg-paper">
      <div className="wrap py-10">
        <p className="eyebrow">Administration</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy-950">Platform dashboard</h1>
        <p className="mt-3 max-w-2xl text-base text-muted">
          Manage users, monitor content and review reported material.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            { icon: Users, label: "Students", value: students.length },
            { icon: GraduationCap, label: "Teachers", value: teachers.length },
            { icon: BookOpen, label: "Courses", value: courses.length },
            { icon: FileCheck2, label: "Quizzes", value: quizzes.length },
            { icon: Flag, label: "Open reports", value: openReports.length },
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

        <div className="mt-10 space-y-8">
          <section className="card overflow-hidden" aria-labelledby="users-heading">
            <div className="border-b border-line px-6 py-4">
              <h2 id="users-heading" className="font-bold text-navy-950">Users</h2>
            </div>
            <div className="px-6 py-4">
              <UsersTable users={allUsers} />
            </div>
          </section>

          <section className="card overflow-hidden" aria-labelledby="reports-heading">
            <div className="border-b border-line px-6 py-4">
              <h2 id="reports-heading" className="font-bold text-navy-950">Reported content</h2>
            </div>
            <div className="px-6 py-4">
              <ReportsTable reports={reports} />
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-navy-950">Platform settings</h2>
            <p className="mt-2 text-sm text-muted">
              Regional content, language packs and AI provider configuration are
              managed through environment variables (see .env.example) and the
              Supabase console. Educator features are enabled per-role.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
