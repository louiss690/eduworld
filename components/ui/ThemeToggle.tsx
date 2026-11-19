"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — switches between light and dark mode.
 *
 * Persists the choice in localStorage (`ew-theme`); before the user ever
 * chooses, the OS preference applies (set by the inline init script in the
 * root layout). A brief `theme-anim` class cross-fades colours on switch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.getAttribute("data-theme") === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ew-theme", next);
    } catch {
      /* private mode — theme still applies for this session */
    }
    setDark(next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "grid size-10 place-items-center rounded-lg border border-line text-navy-700 transition-colors duration-200 hover:bg-surface3 hover:text-navy-950",
        className
      )}
    >
      {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
    </button>
  );
}
