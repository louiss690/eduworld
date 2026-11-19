import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { demoLabelEnabled } from "@/lib/env";
import { DemoBadge } from "@/components/ui/DemoBadge";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="wrap flex items-center justify-between py-5">
        <Link href="/" aria-label="EduWorld home">
          <Logo />
        </Link>
        {demoLabelEnabled() && <DemoBadge />}
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-navy-950">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          </div>
          <div className="card p-6 sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
      </main>

      <footer className="border-t border-line py-6 text-center text-[13px] text-muted">
        © {new Date().getFullYear()} EduWorld · Education Without Borders. Knowledge Without Limits.
      </footer>
    </div>
  );
}
