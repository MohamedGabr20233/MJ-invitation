// lib/motion.ts

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

let mediaQuery: MediaQueryList | null = null;

const getMediaQuery = () => {
  mediaQuery ??= window.matchMedia(QUERY);
  return mediaQuery;
};

/** Imperative read, for code outside the render cycle (GSAP callbacks). */
export const prefersReducedMotion = () => getMediaQuery().matches;

const subscribe = (onChange: () => void) => {
  const query = getMediaQuery();
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
};

/**
 * Reactive version of the same flag. Read through the store rather than an
 * effect, so no synchronous setState is needed and a mid-visit OS change is
 * picked up.
 */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
