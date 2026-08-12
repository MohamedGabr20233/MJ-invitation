// components/gate/EnvelopeCover.tsx

import type { Ref } from "react";

import EnvelopeFlap from "./EnvelopeFlap";
import WaxButton from "./WaxButton";
import { GATE_IMAGES } from "./gateAssets";

// Refs are passed one prop each, not bundled in an object — reading
// `props.refs.x` in JSX counts as a ref access during render.
type EnvelopeCoverProps = {
  onOpen: () => void;
  /** False while the loader is still up, so the seal can't be clicked early. */
  isInteractive: boolean;
  overlayRef: Ref<HTMLDivElement>;
  coverRef: Ref<HTMLDivElement>;
  leftFlapRef: Ref<HTMLDivElement>;
  rightFlapRef: Ref<HTMLDivElement>;
  leftShadowRef: Ref<HTMLDivElement>;
  rightShadowRef: Ref<HTMLDivElement>;
  sealRef: Ref<HTMLDivElement>;
  flashRef: Ref<HTMLDivElement>;
};

/**
 * Pure visuals for the gate: two flaps, the wax seal, and the flash layer.
 * Owns no state — the timeline drives everything through the refs, including the
 * opacity that keeps this hidden until the images are decoded.
 * Pinned to the viewport at the same width as the site column.
 */
const EnvelopeCover = ({
  onOpen,
  isInteractive,
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

        <WaxButton
          onClick={onOpen}
          disabled={!isInteractive}
          ref={sealRef}
        />
      </div>

      {/* White flash that hides the cover → site swap */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white opacity-0"
      />
    </div>
  );
};

export default EnvelopeCover;
