import { SiteHeader } from "@/components/layout/SiteHeader";
import { FooterGate } from "@/components/layout/FooterGate";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { AnimationGuard } from "@/components/ui/AnimationGuard";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <FooterGate />
      <PwaRegister />
      <AnimationGuard />
    </div>
  );
}
