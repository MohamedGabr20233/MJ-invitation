// lib/useRevealOnView.ts

import type { RevealOptions } from "../types";
import { gsap, useGSAP } from "./gsap";

/**
 * Plays a `from` tween the first time `root` scrolls into view.
 *
 * IntersectionObserver rather than ScrollTrigger: ScrollTrigger resolves `start`
 * to a pixel offset when the trigger is created, and this page's images declare
 * no dimensions, so the document grows on load and leaves that number stale —
 * one-shot triggers end up firing at scroll 0. The browser recomputes
 * intersection from live layout instead, which also means the gate needs no
 * special case: behind the cover the section has no visible box, so the observer
 * correctly stays quiet.
 */
export const useRevealOnView = (root: string, targets: string, vars: gsap.TweenVars, { rootMargin = "0px 0px -20% 0px" }: RevealOptions = {}) => {
  useGSAP(
    () => {
      // `from` renders its start values immediately, so targets are hidden on the
      // first frame; built inside this callback so useGSAP's context reverts it.
      const reveal = gsap.from(targets, { ...vars, paused: true });

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Fires once on observe() with the current state, hence the guard.
          if (!entry.isIntersecting) return;

          observer.disconnect();
          reveal.play();
        },
        { rootMargin },
      );

      const element = document.querySelector(root);
      if (element) observer.observe(element);

      return () => observer.disconnect();
    },
    // `vars` is a fresh object every render and is only read at setup, so it is
    // deliberately not a dependency.
    { scope: root, dependencies: [root, targets, rootMargin] },
  );
};
