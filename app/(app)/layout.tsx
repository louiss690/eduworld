import { AppShell } from "@/components/layout/AppShell";
import { FooterGate } from "@/components/layout/FooterGate";

/**
 * App shell for authenticated student surfaces — My Learning, tutor,
 * results, settings, onboarding and portals. The dashboard lives here,
 * never on the public homepage.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <FooterGate />
    </>
  );
}
