// components/gate/EnvelopeCover.tsx

import type { EnvelopeCoverProps } from "../../types";
import EnvelopeFlap from "./EnvelopeFlap";
import WaxButton from "./WaxButton";
import { GATE_IMAGES } from "./gateAssets";

/**
 * Pure visuals for the gate: two flaps, the wax seal, and the flash layer.
 * Owns no state — the choreography hook drives everything by adding classes to
 * these refs, including the opacity that keeps this hidden until the images are
 * decoded. Pinned to the viewport at the same width as the site column.
 */
const EnvelopeCover = ({
  overlayRef,
  coverRef,
  leftFlapRef,
  rightFlapRef,
  leftShadowRef,
  rightShadowRef,
  sealRef,
  flashRef,
}: EnvelopeCoverProps) => {
  return (
    <div
      ref={overlayRef}
      className="fixed inset-y-0 left-1/2 z-50 w-full -translate-x-1/2 overflow-hidden opacity-0 perspective-[1400px] transform-3d lg:max-w-150"
    >
      <div ref={coverRef} className="absolute inset-0">
        <EnvelopeFlap
          side="left"
          image={GATE_IMAGES.leftFlap}
          ref={leftFlapRef}
          shadowRef={leftShadowRef}
        />

        <EnvelopeFlap
          side="right"
          image={GATE_IMAGES.rightFlap}
          ref={rightFlapRef}
          shadowRef={rightShadowRef}
        />

        <WaxButton ref={sealRef} />
      </div>

      {/* White flash that hides the cover → site swap */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-surface-raised opacity-0"
      />
    </div>
  );
};

export default EnvelopeCover;
