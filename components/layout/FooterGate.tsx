"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { TutorFooter } from "./TutorFooter";

/**
 * Chooses the footer per route.
 *  - Slim footer: immersive/task pages (tutor, dashboard, results, settings,
 *    onboarding, lessons, quizzes, teacher/admin portals).
 *  - Full footer: content and marketing pages where users browse and discover.
 */
const SLIM_PREFIXES = [
  "/tutor",
  "/dashboard",
  "/results",
  "/settings",
  "/onboarding",
  "/teacher",
  "/admin",
];

export function FooterGate() {
  const pathname = usePathname();
  const isSlim =
    SLIM_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.includes("/lessons/") ||
    pathname.includes("/quiz/");
  return isSlim ? <TutorFooter /> : <SiteFooter />;
}
