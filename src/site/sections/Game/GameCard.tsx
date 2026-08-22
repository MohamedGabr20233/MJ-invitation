import { useRef } from "react";
import { gsap, useGSAP } from "../../../lib/gsap";
import type { GameCardProps } from "../../../types";

const CARD_WIDTH = 190;

/** The card art ships as 190/380/570px webp variants so the browser never has to downscale a huge source. */
const cardSrcSet = (base: string) => [190, 380, 570].map((w) => `${base}-${w}.webp ${w}w`).join(", ");

const GameCard = ({ className, backImage, alt, flipped, turns, matched = false, onSelect }: GameCardProps) => {
  const warpRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rotation = Math.floor(turns / 2) * 720 + (flipped ? 540 : 0);

  useGSAP(
    () => {
      const duration = flipped ? 1 : 0.55;
      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });

      // z-index belongs on the wrapper — the card is inside its own stacking context.
      if (flipped) tl.set(warpRef.current, { zIndex: 50 });

      tl.to(cardRef.current, { rotateY: rotation, duration, ease: flipped ? "power2.inOut" : "power2.out" }, 0)
        // Comes toward the viewer through the turn, then settles back.
        .to(cardRef.current, { z: 140, scale: 1.08, boxShadow: "0px 26px 44px rgba(0,0,0,0.42)", duration: duration / 2, ease: "power2.out" }, 0)
        .to(cardRef.current, { z: 0, scale: 1, boxShadow: "0px 4px 12px rgba(0,0,0,0.18)", duration: duration / 2, ease: "power2.in" }, duration / 2);

      // Sequential, so this lands only once the card is flat and home again.
      if (!flipped) tl.set(warpRef.current, { zIndex: 0 });
    },
    { dependencies: [rotation] },
  );
  return (
    <div ref={warpRef} onClick={onSelect} className={className || "card-wrap relative rounded-xl w-1/3 h-60 min-w-45 perspective-distant px-2"}>
      {/* the card — GSAP owns its transform, so no `transition-transform` to fight over it */}
      <div ref={cardRef} className={`relative h-60 w-full cursor-pointer transform-3d will-change-transform rounded-xl shadow-card ${matched ? "ring-2 ring-highlight/80" : ""}`}>
        {/* the front */}
        <div className="absolute inset-0 backface-hidden">
          <img
            src={`/cards/rapunzel-play-card-${CARD_WIDTH}.webp`}
            srcSet={cardSrcSet("/cards/rapunzel-play-card")}
            sizes={`${CARD_WIDTH}px`}
            alt="play card"
            className={`h-60 w-full rounded-xl object-cover `}
          />
        </div>

        {/* the back */}
        <div className="absolute inset-0 backface-hidden overflow-hidden transform-[rotateY(180deg)]  rounded-xl ">
          <img
            src={`${backImage}-${CARD_WIDTH}.webp`}
            srcSet={cardSrcSet(backImage)}
            sizes={`${CARD_WIDTH}px`}
            alt={alt}
            className={`h-60 w-full rounded-xl object-cover ${alt.includes("bride") && "scale-110 pt-3"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
