import { PublicHeader } from "@/components/layout/PublicHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/**
 * Public site shell — marketing and discovery pages (home, library, subjects,
 * courses, about, help, contact, legal). Clean top navigation and full
 * footer; no app sidebar here.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
