import { AppShell } from "@/components/layout/AppShell";
import { FooterGate } from "@/components/layout/FooterGate";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { AnimationGuard } from "@/components/ui/AnimationGuard";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <FooterGate />
      <PwaRegister />
      <AnimationGuard />
    </>
  );
}
