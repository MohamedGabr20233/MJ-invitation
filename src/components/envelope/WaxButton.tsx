// components/envelope/WaxButton.tsx

import type { Ref } from "react";

type WaxButtonProps = {
  onClick: () => void;
  /** Animated by the timeline — must be a node GSAP alone owns the transform of. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Wax seal sitting on the fold — the only thing that opens the envelope.
 * Positioning lives on the outer wrapper, GSAP scales the inner layer, and the
 * hover transform lives on the button. Three nodes so nothing fights over
 * `transform`.
 */
const WaxButton = ({ onClick, ref }: WaxButtonProps) => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 -translate-x-2/3 -translate-y-2/3">
      <div ref={ref} className="will-change-transform">
        <button
          type="button"
          onClick={onClick}
          aria-label="Open invitation"
          className="pointer-events-auto cursor-pointer border-0 bg-transparent p-0 transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <img
            src="/button.png"
            alt=""
            aria-hidden="true"
            className="w-60 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default WaxButton;
