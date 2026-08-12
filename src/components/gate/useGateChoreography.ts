// components/gate/useGateChoreography.ts

import { useEffect, type RefObject } from "react";

import { prefersReducedMotion } from "../../lib/motion";
import { useGateStore } from "../../store/gateStore";
import { GATE_SWAP_MS } from "./gateTimings";

type ElementRef = RefObject<HTMLElement | null>;

export type GateRefs = {
  /** Overlay root — owns the 3d perspective and the intro fade. */
  overlay: ElementRef;
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
 * Turns the gate phase into motion. The animation itself is CSS (see the gate
 * block in index.css) — this only adds the class that starts each step and
 * advances the store when the step reports back.
 *
 * The store guards its own transitions, so a re-run of either effect is a no-op.
 */
export const useGateChoreography = (refs: GateRefs) => {
  const phase = useGateStore((state) => state.phase);

  // Loader → envelope, once the images are decoded.
  useEffect(() => {
    if (phase !== "intro") return;

    const { introDone } = useGateStore.getState();

    if (prefersReducedMotion()) {
      addClass(refs.overlay, "gate-overlay-instant");
      addClass(refs.loader, "gate-loader-instant");
      introDone();
      return;
    }

    addClass(refs.loader, "gate-loader-out");
    addClass(refs.overlay, "gate-overlay-in");

    // The overlay fade is the longer of the two, so it ends the intro.
    const overlay = refs.overlay.current;
    if (!overlay) {
      introDone();
      return;
    }

    return onOwnAnimationEnd(overlay, introDone);
  }, [phase, refs]);

  // The open sequence: seal off, flap open, flash, swap, site settles.
  useEffect(() => {
    if (phase !== "opening") return;

    const { showSite, reveal } = useGateStore.getState();

    if (prefersReducedMotion()) {
      addClass(refs.cover, "gate-cover-instant");
      addClass(refs.site, "gate-site-instant");
      reveal();
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
    // for it — this timer is the cue for media behind the gate. Started in the
    // same tick as the classes, so it stays in step with them.
    const swapTimer = window.setTimeout(showSite, GATE_SWAP_MS);

    // The site reveal runs longest, so it marks the gate as open.
    const site = refs.site.current;
    if (!site) {
      reveal();
      return () => window.clearTimeout(swapTimer);
    }

    const stopListening = onOwnAnimationEnd(site, reveal);

    return () => {
      window.clearTimeout(swapTimer);
      stopListening();
    };
  }, [phase, refs]);
};
