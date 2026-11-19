import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/services/auth/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your EduWorld account.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "teacher" ? "/teacher" : user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your learning journey."
      footer={
        <>
          New to EduWorld?{" "}
          <Link href="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
