// components/gate/GateLoader.tsx

import type { Ref } from "react";

type GateLoaderProps = {
  /** 0 → 1. */
  progress: number;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Sits above the envelope until the gate images are decoded, so the first thing
 * a phone paints is this and not a half-loaded letter.
 */
const GateLoader = ({ progress, ref }: GateLoaderProps) => {
  const percent = Math.round(progress * 100);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="fixed inset-y-0 left-1/2 z-[60] flex w-full -translate-x-1/2 flex-col items-center justify-center bg-background lg:max-w-150"
    >
      <span className="text-xs uppercase tracking-[0.3em] text-primary/70">
        Loading
      </span>

      <div className="mt-4 h-px w-32 overflow-hidden bg-primary/20">
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <span className="sr-only">{percent}% loaded</span>
    </div>
  );
};

export default GateLoader;
