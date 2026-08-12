// hooks/useEnvelopeAnimation.ts

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useRef, type RefObject } from "react";

type ElementRef = RefObject<HTMLElement | null>;

export type EnvelopeRefs = {
  /** Scope for every tween. Also owns the 3d perspective. */
  container: RefObject<HTMLDivElement | null>;
  /** Flap that swings open. */
  rightFlap: ElementRef;
  leftShadow: ElementRef;
  rightShadow: ElementRef;
  /** Wraps both flaps, removed once the invitation is revealed. */
  cover: ElementRef;
  /** Wax seal, animates out before the flap moves. */
  button: ElementRef;
  /** Full-screen white flash that masks the content swap. */
  flash: ElementRef;
  /** The invitation itself, sitting behind the cover. */
  invitation: ElementRef;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Builds the paused open-envelope timeline and hands back an `open()` trigger.
 * The timeline is created once inside `useGSAP` so it is reverted on unmount.
 */
export const useEnvelopeAnimation = (refs: EnvelopeRefs) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      // Right flap always sits slightly in front of the left one.
      gsap.set(refs.rightFlap.current, { z: 3, zIndex: 30, force3D: true });

      gsap.set(refs.invitation.current, { opacity: 0, scale: 1.03 });
      gsap.set(refs.flash.current, { opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      // 1. Wax seal slides off to the right.
      tl.to(
        refs.button.current,
        {
          x: 120,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          pointerEvents: "none",
        },
        0,
      );

      // 2. Flap swings open — z stays at 3, don't touch it here.
      tl.to(
        refs.rightFlap.current,
        {
          rotateY: 30,
          x: 5,
          duration: 1,
          ease: "power3.inOut",
        },
        0.2,
      );

      // 3. Shadows deepen along the fold.
      tl.to(
        [refs.leftShadow.current, refs.rightShadow.current],
        {
          opacity: 0.3,
          duration: 0.7,
          ease: "power2.out",
        },
        0.2,
      );

      // 4. Flash masks the swap.
      tl.to(refs.flash.current, {
        opacity: 1,
        duration: 0.12,
        ease: "power2.in",
      });

      // 5. Swap cover for invitation while the screen is white.
      tl.set(refs.cover.current, { display: "none" });
      tl.set(refs.invitation.current, { opacity: 1 });

      // 6. Fade the flash back out as the invitation settles.
      tl.to(refs.flash.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });

      tl.to(
        refs.invitation.current,
        {
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "<",
      );

      timelineRef.current = tl;
    },
    { scope: refs.container },
  );

  const open = useCallback(() => {
    const tl = timelineRef.current;

    // Ignore clicks once the sequence has started.
    if (!tl || tl.isActive() || tl.progress() > 0) return;

    if (prefersReducedMotion()) {
      tl.progress(1);
      return;
    }

    tl.play();
  }, []);

  return { open };
};
