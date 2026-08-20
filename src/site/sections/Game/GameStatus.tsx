// site/sections/Game/GameStatus.tsx

import { useRef } from "react";

import DiamondRule from "../../../components/icons/DiamondRule";
import { gsap, useGSAP } from "../../../lib/gsap";
import { prefersReducedMotion } from "../../../lib/motion";
import type { GameStatusProps } from "../../../types";

/**
 * The game's only feedback: a script win line under a gold rule, or a small
 * uppercase nudge after a wrong pair — same type scale as the countdown labels.
 *
 * `misses` is a dependency, not just a boolean, so every new wrong pair replays
 * the shake instead of the line sitting there already animated.
 */
const GameStatus = ({ solved, misses }: GameStatusProps) => {
  const lineRef = useRef<HTMLDivElement | null>(null);

  const hasStatus = solved || misses > 0;

  useGSAP(
    () => {
      if (!lineRef.current || !hasStatus) return;

      if (prefersReducedMotion()) {
        gsap.set(lineRef.current, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      if (solved) {
        // Settles in with a little overshoot, then the rule draws out from its centre.
        gsap
          .timeline()
          .fromTo(lineRef.current, { opacity: 0, y: 12, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.5, ease: "back.out(1.6)" })
          .fromTo(".status-rule", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.35");

        return;
      }

      // Wrong pair: rises in and shakes its head.
      gsap
        .timeline()
        .fromTo(lineRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.5, ease: "power2.out" })
        .to(lineRef.current, { keyframes: { x: [-5, 5, -3, 3, 0] }, duration: 0.42, ease: "power1.inOut" });
    },
    // `scope` also bounds the `.status-rule` lookup to this line.
    { dependencies: [solved, misses], scope: lineRef },
  );

  // The box is always here, so the cards never shift when the line appears.
  return (
    <div className="flex min-h-14 items-center justify-center pt-10">
      {!hasStatus ? null : solved ? (
        <div ref={lineRef} className="flex flex-col items-center gap-1">
          <p className="font-alex text-primary text-3xl leading-none">you found the two of us</p>

          <DiamondRule className="status-rule h-2 w-36 origin-center" />
        </div>
      ) : (
        <div ref={lineRef} className="text-secondary flex items-center gap-2">
          <span className="text-[10px] leading-none">♦</span>

          <p className="font-cormorant text-[12px] font-semibold tracking-[0.28em] uppercase">not the couple — try again</p>

          <span className="text-[10px] leading-none">♦</span>
        </div>
      )}
    </div>
  );
};

export default GameStatus;
