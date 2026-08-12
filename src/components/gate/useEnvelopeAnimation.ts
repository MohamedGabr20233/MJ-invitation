// components/gate/useEnvelopeAnimation.ts

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, type RefObject } from "react";

type ElementRef = RefObject<HTMLElement | null>;

export type EnvelopeRefs = {
  /** Overlay root — tween scope and owner of the 3d perspective. */
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
  /** The site is fully revealed. */
  onOpened: () => void;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Owns the whole gate choreography: the intro fade from loader to envelope, and
 * the paused open-the-gate timeline behind `open()`.
 */
export const useEnvelopeAnimation = (refs: EnvelopeRefs, { isReady, onIntroDone, onOpened }: EnvelopeOptions) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasPlayedIntroRef = useRef(false);

  // Kept in refs so the timelines never close over stale callbacks.
  const onIntroDoneRef = useRef(onIntroDone);
  const onOpenedRef = useRef(onOpened);

  useEffect(() => {
    onIntroDoneRef.current = onIntroDone;
    onOpenedRef.current = onOpened;
  }, [onIntroDone, onOpened]);

  useGSAP(
    () => {
      // The envelope stays invisible until its images are decoded.
      gsap.set(refs.overlay.current, { opacity: 0 });

      // Right flap always sits slightly in front of the left one.
      gsap.set(refs.rightFlap.current, { z: 3, zIndex: 30, force3D: true });

      gsap.set(refs.site.current, { opacity: 0, scale: 1.03 });
      gsap.set(refs.flash.current, { opacity: 0 });

      const tl = gsap.timeline({
        paused: true,
        onComplete: () => onOpenedRef.current(),
      });

      // 1. Wax seal slides off to the right.
      tl.to(
        refs.seal.current,
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

      // 5. Drop the cover and bring the site in while the screen is white.
      tl.set(refs.cover.current, { display: "none" });
      tl.set(refs.site.current, { opacity: 1 });

      // 6. Fade the flash out as the site settles.
      tl.to(refs.flash.current, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
      });

      tl.to(
        refs.site.current,
        {
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "<",
      );

      timelineRef.current = tl;
    },
    { scope: refs.overlay },
  );

  // Loader → envelope, once the images are decoded. Lives in an effect rather
  // than an exported callback: reading `refs.x.current` inside a useCallback
  // makes the React Compiler bail on the whole hook.
  useEffect(() => {
    if (!isReady || hasPlayedIntroRef.current) return;
    hasPlayedIntroRef.current = true;

    if (prefersReducedMotion()) {
      gsap.set(refs.overlay.current, { opacity: 1 });
      gsap.set(refs.loader.current, { opacity: 0 });
      onIntroDoneRef.current();
      return;
    }

    const intro = gsap.timeline({
      onComplete: () => onIntroDoneRef.current(),
    });

    intro.to(refs.loader.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    intro.to(
      refs.overlay.current,
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      0.1,
    );

    return () => {
      intro.kill();
    };
  }, [isReady, refs]);

  const open = useCallback(() => {
    const tl = timelineRef.current;

    // Ignore clicks once the sequence has started.
    if (!tl || tl.isActive() || tl.progress() > 0) return;

    if (prefersReducedMotion()) {
      // Jump to the end state with events suppressed, then report once.
      tl.progress(1, true);
      onOpenedRef.current();
      return;
    }

    tl.play();
  }, []);

  return { open };
};
