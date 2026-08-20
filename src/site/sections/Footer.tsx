import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";
import DiamondRule from "../../components/icons/DiamondRule";
import { COUPLES_NAMES } from "../../constants";
import { useRevealOnView } from "../../lib/useRevealOnView";

const Footer = () => {
  const { MALE, FEMALE } = COUPLES_NAMES;
  /** Read once at render — a hardcoded year goes stale the moment it turns. */
  const year = new Date().getFullYear();

  const lineRef = useRef<HTMLDivElement | null>(null);
  const boatRef = useRef<HTMLImageElement | null>(null);

  useRevealOnView("#footer", ".reveal-in", {
    opacity: 0,
    duration: 1,
    y: 20,
    stagger: 0.4,
  });

  /**
   * The boat rides a swell. Two loops rather than one, on deliberately
   * mismatched periods (2.1s rise, 3.4s roll) so they drift in and out of phase
   * and never settle into an obvious rhythm — a single tween reads as a machine.
   *
   * These live on the image while `.reveal-in` sits on its wrapper: the reveal
   * also tweens `y`, and two tweens writing one property on one element fight.
   */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(boatRef.current, { y: 0 }, { y: -9, duration: 2.1, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.fromTo(boatRef.current, { rotation: -1.8 }, { rotation: 1.8, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });

      return () => mm.revert();
    },
    { dependencies: [] },
  );
  return (
    <footer id="footer" className="flex flex-col w-full items-center text-primary">
      <div ref={lineRef} className="reveal-in flex flex-col items-center gap-1">
        <p className="text-4xl font-alex font-medium">" And at last we see the light "</p>
        <DiamondRule className="status-rule h-2 w-36 origin-center" />
      </div>

      {/* the boat image — wrapper reveals, image rocks */}
      <div className="reveal-in w-80 -mt-25 -mb-25">
        <img ref={boatRef} src="/boat.png" alt="rapunzel boat" className="[clip-path:polygon(0_30%,100%_30%,100%_75%,0_75%)] w-full" />
      </div>

      <hr className=" mt-4 border-black/20 w-[80%]" />
      {/* the rights line */}
      <div className="flex w-full flex-col items-center gap-1 pt-4 pb-6 text-center">
        <p className="font-sans text-xs tracking-wide">
          © {year} {MALE} &amp; {FEMALE}. All rights reserved.
        </p>
        <p className="font-sans text-[0.7rem] tracking-[0.18em] uppercase opacity-60">Made by Gvite</p>
      </div>
    </footer>
  );
};

export default Footer;
