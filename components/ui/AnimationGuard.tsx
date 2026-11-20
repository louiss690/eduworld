"use client";

import { useEffect } from "react";

/**
 * AnimationGuard, safety net for entrance animations.
 *
 * If the hero entrance animation hasn't completed shortly after load (for
 * example on a throttled preview or if any animation failure occurs), the
 * guard adds `anim-ready` to <body>, which forces all entrance content
 * visible. In normal browsers the animation finishes first and the guard
 * is a no-op.
 */
export function AnimationGuard() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.body.classList.contains("anim-ready")) return;
      const hero = document.querySelector(".hero-anim");
      if (hero && getComputedStyle(hero).opacity === "0") {
        document.body.classList.add("anim-ready");
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
