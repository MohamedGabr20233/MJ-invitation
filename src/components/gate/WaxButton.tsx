// components/gate/WaxButton.tsx

import type { Ref } from "react";

import { GATE_IMAGES } from "./gateAssets";

type WaxButtonProps = {
  onClick: () => void;
  /** False until the gate images are decoded. */
  disabled?: boolean;
  /** True once the open sequence has started — idle cues stand down. */
  isOpening?: boolean;
  /** Animated by the gate classes — a node nothing else transforms. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Wax seal sitting on the fold — the only thing that opens the gate.
 * Positioning lives on the outer wrapper, the slide-off runs on the middle
 * layer, the hover transform on the button, and the idle breathe on the image.
 * Four nodes so nothing fights over `transform`.
 */
const WaxButton = ({
  onClick,
  disabled = false,
  isOpening = false,
  ref,
}: WaxButtonProps) => {
  const isIdle = !disabled && !isOpening;

  // Nothing until the images are in, so the hint rises with the envelope.
  const hintClass = isOpening
    ? "gate-hint-out"
    : isIdle
      ? "gate-hint-in"
      : "";

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
            className={`w-50 object-contain ${isIdle ? "gate-seal-pulse" : ""}`}
          />
        </button>

        {/* Decorative — the button already announces itself to screen readers */}
        <span
          aria-hidden="true"
          className={`pointer-events-none mt-2 block text-center text-[0.625rem] uppercase tracking-[0.3em] text-primary/70 opacity-0 ${hintClass}`}
        >
          Tap to open
        </span>
      </div>
    </div>
  );
};

export default WaxButton;
