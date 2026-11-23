import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

/**
 * Slim footer used on the AI Tutor page — keeps legal/support links
 * reachable without the heavy marketing footer.
 */
const LINKS = [
  { label: "Help Centre", href: "/help" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function TutorFooter() {
  return (
    <footer className="bg-deep text-deep-2">
      <div className="wrap flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <Link href="/" aria-label="EduWorld home" className="[&_span]:text-white">
          <Logo />
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-deep-2 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-[13px] text-deep-2">© {new Date().getFullYear()} EduWorld</p>
      </div>
    </footer>
  );
}
