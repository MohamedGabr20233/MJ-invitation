// gate/EnvelopeFlap.tsx

import type { Ref } from "react";

type EnvelopeFlapProps = {
  side: "left" | "right";
  /** Half of the letter artwork, rendered at 200% width and cropped. */
  image: string;
  ref?: Ref<HTMLDivElement>;
  /** Ref for the fold shadow overlay, animated by the gate classes. */
  shadowRef?: Ref<HTMLDivElement>;
};

// `gate-flap-front` is the static translateZ that keeps the right flap in front
// of the left one — the open keyframe carries it through the swing.
const flapClasses = {
  left: "left-0 z-20 origin-left",
  right: "right-0 z-30 origin-right gate-flap-front",
} as const;

const imageClasses = {
  left: "left-0",
  right: "right-0",
} as const;

const shadowClasses = {
  left: "right-0 bg-linear-to-l",
  right: "left-0 bg-linear-to-r",
} as const;

const EnvelopeFlap = ({ side, image, ref, shadowRef }: EnvelopeFlapProps) => {
  return (
    <div
      ref={ref}
      className={`absolute top-0 h-full w-1/2 transform-3d backface-hidden will-change-transform ${flapClasses[side]}`}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 h-full w-[200%] max-w-none object-cover ${imageClasses[side]}`}
      />

      <div
        ref={shadowRef}
        className={`pointer-events-none absolute top-0 z-10 h-full w-16 from-black/30 to-transparent opacity-0 blur-xl ${shadowClasses[side]}`}
      />
    </div>
  );
};

export default EnvelopeFlap;
