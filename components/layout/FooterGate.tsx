"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { TutorFooter } from "./TutorFooter";

/**
 * Chooses the footer per route. The immersive AI Tutor page gets the slim
 * footer; every other page keeps the full site footer.
 */
export function FooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/tutor")) return <TutorFooter />;
  return <SiteFooter />;
}
