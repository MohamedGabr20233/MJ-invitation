// components/gate/WaxButton.tsx

import type { Ref } from "react";

import { GATE_IMAGES } from "./gateAssets";

type WaxButtonProps = {
  onClick: () => void;
  /** False until the gate images are decoded. */
  disabled?: boolean;
  /** Animated by the timeline — a node GSAP alone owns the transform of. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Wax seal sitting on the fold — the only thing that opens the gate.
 * Positioning lives on the outer wrapper, GSAP moves the middle layer, and the
 * hover transform lives on the button. Three nodes so nothing fights over
 * `transform`.
 */
const WaxButton = ({ onClick, disabled = false, ref }: WaxButtonProps) => {
  return (
    <div className="pointer-events-none absolute inset-s-[15%] xl:inset-s-[25%] top-1/2 z-40  -translate-y-2/3">
      <div ref={ref} className="will-change-transform">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label="Open invitation"
          className="pointer-events-auto cursor-pointer  border-0 bg-transparent p-0 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <img
            src={GATE_IMAGES.seal}
            alt=""
            aria-hidden="true"
            className="w-50 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default WaxButton;
