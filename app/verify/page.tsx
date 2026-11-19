import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Check your email",
  description: "Verify your email address to activate your EduWorld account.",
};

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <AuthShell title="Check your email" subtitle="One more step to start learning.">
      <div className="text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-600">
          <MailCheck className="size-6" aria-hidden />
        </div>
        <p className="text-sm leading-relaxed text-muted">
          We sent a verification link to your email address. Click the link to
          activate your account, then sign in.
        </p>
        <p className="mt-5 text-[13px] text-muted">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            try signing in
          </Link>{" "}
          again.
        </p>
      </div>
    </AuthShell>
  );
}
