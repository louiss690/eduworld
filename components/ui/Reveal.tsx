"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal — scroll-triggered entrance animation.
 *
 * Adds a `.reveal` class (hidden state) and flips it to `.is-visible` when
 * the element enters the viewport. Only transform/opacity are animated, and
 * the global prefers-reduced-motion rule neutralises the effect entirely.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  scale = false,
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts */
  delay?: number;
  /** Use a subtle scale-in instead of pure fade-up */
  scale?: boolean;
  style?: CSSProperties;
  as?: "div" | "li" | "section" | "article" | "span" | "figure";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "reveal",
        scale && "reveal-scale",
        visible && "is-visible",
        className
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
