import Link from "next/link";
import { Globe, Mail, MessageCircle, Rss } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/ui/Reveal";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "EduWorld",
    links: [
      { label: "About", href: "/about" },
      { label: "Explore Courses", href: "/library" },
      { label: "Subjects", href: "/subjects" },
      { label: "AI Tutor", href: "/tutor" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/help" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Accessibility", href: "/about#accessibility" },
    ],
  },
  {
    title: "Learners",
    links: [
      { label: "Sign Up", href: "/signup" },
      { label: "Log In", href: "/login" },
      { label: "Student Dashboard", href: "/dashboard" },
    ],
  },
];

const SOCIALS = [
  { label: "X (formerly Twitter)", href: "#", icon: MessageCircle },
  { label: "Community", href: "#", icon: Mail },
  { label: "Blog", href: "#", icon: Rss },
  { label: "Global", href: "#", icon: Globe },
];

export function SiteFooter() {
  return (
    <footer className="bg-deep text-deep-2">
      <div className="wrap grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Link href="/" className="inline-block [&_span]:text-white">
            <Logo />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-deep-2">
            Education Without Borders. Knowledge Without Limits. Making quality
            education accessible to every learner, everywhere.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-lg border border-white/10 text-deep-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </Reveal>

        {COLUMNS.map((col, i) => (
          <Reveal key={col.title} delay={120 + i * 80}>
            <h3 className="text-sm font-semibold text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-deep-2 transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-[13px] text-deep-2 sm:flex-row">
          <p>© {new Date().getFullYear()} EduWorld. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Globe className="size-3.5" />
            English (International) · Available worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
