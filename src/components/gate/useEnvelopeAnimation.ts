// components/gate/useEnvelopeAnimation.ts

import { useCallback, useEffect, useRef, type RefObject } from "react";

import { prefersReducedMotion } from "../../lib/motion";
import { GATE_SWAP_MS } from "./gateTimings";

type ElementRef = RefObject<HTMLElement | null>;

export type EnvelopeRefs = {
  /** Overlay root — owns the 3d perspective and the intro fade. */
  overlay: RefObject<HTMLDivElement | null>;
  /** Loading screen shown until the gate images are decoded. */
  loader: ElementRef;
  /** Flap that swings open. */
  rightFlap: ElementRef;
  leftShadow: ElementRef;
  rightShadow: ElementRef;
  /** Wraps both flaps, hidden once the site is revealed. */
  cover: ElementRef;
  /** Wax seal, slides off before the flap moves. */
  seal: ElementRef;
  /** White flash that masks the cover → site swap. */
  flash: ElementRef;
  /** The site behind the gate. Lives outside the overlay. */
  site: ElementRef;
};

type EnvelopeOptions = {
  /** True once the gate images are decoded — flips the intro on. */
  isReady: boolean;
  /** Images are in and the envelope has faded up — the loader can go. */
  onIntroDone: () => void;
  /** The cover just dropped, so the site is on screen — media can start. */
  onSiteVisible: () => void;
  /** The site is fully revealed. */
  onOpened: () => void;
};

const addClass = (ref: ElementRef, ...names: string[]) =>
  ref.current?.classList.add(...names);

/**
 * Fires `onEnd` when `element`'s own animation finishes, once. `animationend`
 * bubbles, so the target check keeps a child's animation — the seal pulse, the
 * hint — from ending the step early. Returns the teardown.
 */
const onOwnAnimationEnd = (element: HTMLElement, onEnd: () => void) => {
  const handleEnd = (event: AnimationEvent) => {
    if (event.target !== element) return;

    element.removeEventListener("animationend", handleEnd);
    onEnd();
  };

  element.addEventListener("animationend", handleEnd);

  return () => element.removeEventListener("animationend", handleEnd);
};

/**
 * Owns the gate choreography. The motion itself is CSS (see the gate block in
 * index.css) — this only adds the classes that start each step and listens for
 * the last `animationend` to report back.
 */
export const useEnvelopeAnimation = (
  refs: EnvelopeRefs,
  { isReady, onIntroDone, onSiteVisible, onOpened }: EnvelopeOptions,
) => {
  const hasPlayedIntroRef = useRef(false);
  const hasOpenedRef = useRef(false);
  const swapTimerRef = useRef(0);

  // Kept in refs so the listeners never close over stale callbacks.
  const onIntroDoneRef = useRef(onIntroDone);
  const onSiteVisibleRef = useRef(onSiteVisible);
  const onOpenedRef = useRef(onOpened);

  useEffect(() => {
    onIntroDoneRef.current = onIntroDone;
    onSiteVisibleRef.current = onSiteVisible;
    onOpenedRef.current = onOpened;
  }, [onIntroDone, onSiteVisible, onOpened]);

  useEffect(() => () => window.clearTimeout(swapTimerRef.current), []);

  // Loader → envelope, once the images are decoded. Lives in an effect rather
  // than an exported callback: reading `refs.x.current` inside a useCallback
  // makes the React Compiler bail on the whole hook.
  useEffect(() => {
    if (!isReady || hasPlayedIntroRef.current) return;
    hasPlayedIntroRef.current = true;

    if (prefersReducedMotion()) {
      addClass(refs.overlay, "gate-overlay-instant");
      addClass(refs.loader, "gate-loader-instant");
      onIntroDoneRef.current();
      return;
    }

    addClass(refs.loader, "gate-loader-out");
    addClass(refs.overlay, "gate-overlay-in");

    // The overlay fade is the longer of the two, so it ends the intro.
    const overlay = refs.overlay.current;
    if (!overlay) {
      onIntroDoneRef.current();
      return;
    }

    return onOwnAnimationEnd(overlay, () => onIntroDoneRef.current());
  }, [isReady, refs]);

  const open = useCallback(() => {
    // Ignore clicks once the sequence has started.
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    if (prefersReducedMotion()) {
      addClass(refs.cover, "gate-cover-instant");
      addClass(refs.site, "gate-site-instant");
      onSiteVisibleRef.current();
      onOpenedRef.current();
      return;
    }

    addClass(refs.seal, "gate-seal-out");
    addClass(refs.rightFlap, "gate-flap-out");
    addClass(refs.leftShadow, "gate-shadow-out");
    addClass(refs.rightShadow, "gate-shadow-out");
    addClass(refs.flash, "gate-flash-run");
    addClass(refs.cover, "gate-cover-hide");
    addClass(refs.site, "gate-site-in");

    // The cover drop is a step inside the reveal animation, so there is no event
    // for it — this timer is the cue for media behind the gate. Fired from the
    // same click that started the animation, so it stays in step with it.
    swapTimerRef.current = window.setTimeout(
      () => onSiteVisibleRef.current(),
      GATE_SWAP_MS,
    );

    // The site reveal runs longest, so it marks the gate as open.
    const site = refs.site.current;
    if (!site) {
      onOpenedRef.current();
      return;
    }

    onOwnAnimationEnd(site, () => onOpenedRef.current());
  }, [refs]);

  return { open };
};
