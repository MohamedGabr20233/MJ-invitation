// lib/motion.ts

const QUERY = "(prefers-reduced-motion: reduce)";

let mediaQuery: MediaQueryList | null = null;

const getMediaQuery = () => {
  mediaQuery ??= window.matchMedia(QUERY);
  return mediaQuery;
};

/**
 * Read imperatively rather than through a hook: the gate needs this inside
 * effects, where it also has to skip waiting on `animationend` — that event
 * never fires once the reduced-motion media query turns the animation off.
 */
export const prefersReducedMotion = () => getMediaQuery().matches;
