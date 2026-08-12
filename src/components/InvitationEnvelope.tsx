// components/InvitationEnvelope.tsx

import { useRef } from "react";

import EnvelopeFlap from "./envelope/EnvelopeFlap";
import InvitationContent from "./envelope/InvitationContent";
import WaxButton from "./envelope/WaxButton";
import { useEnvelopeAnimation } from "../hooks/useEnvelopeAnimation";

const InvitationEnvelope = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const leftFlapRef = useRef<HTMLDivElement>(null);
  const rightFlapRef = useRef<HTMLDivElement>(null);

  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);

  const coverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const invitationRef = useRef<HTMLDivElement>(null);

  const { open } = useEnvelopeAnimation({
    container: containerRef,
    rightFlap: rightFlapRef,
    leftShadow: leftShadowRef,
    rightShadow: rightShadowRef,
    cover: coverRef,
    button: buttonRef,
    flash: flashRef,
    invitation: invitationRef,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-dvh w-full overflow-hidden perspective-[1400px] transform-3d lg:max-w-150"
    >
      <div
        ref={invitationRef}
        className="absolute inset-0 z-0 h-full w-full bg-[#fffbed]"
      >
        <InvitationContent />
      </div>

      <div ref={coverRef}>
        <EnvelopeFlap
          side="left"
          image="/letter-left.png"
          ref={leftFlapRef}
          shadowRef={leftShadowRef}
        />

        <EnvelopeFlap
          side="right"
          image="/letter-right2.png"
          ref={rightFlapRef}
          shadowRef={rightShadowRef}
        />

        <WaxButton onClick={open} ref={buttonRef} />
      </div>

      {/* White flash that hides the cover → invitation swap */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-50 bg-white opacity-0"
      />
    </div>
  );
};

export default InvitationEnvelope;
