import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/services/auth/session";
import { getDataStore } from "@/services/data";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Join EduWorld — quality education accessible to every learner.",
};

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const store = getDataStore();
  const [countries, languages, levels] = await Promise.all([
    store.getCountries(),
    store.getLanguages(),
    store.getLevels(),
  ]);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free forever. Learn at your own pace, anywhere in the world."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm countries={countries} languages={languages} levels={levels} />
    </AuthShell>
  );
}
