import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/ResetForm";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your EduWorld account.",
};

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Make it unique and at least 8 characters."
      footer={
        <>
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Back to sign in
          </Link>
        </>
      }
    >
      <ResetForm />
    </AuthShell>
  );
}
