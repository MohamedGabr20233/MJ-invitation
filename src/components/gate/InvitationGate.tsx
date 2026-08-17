// components/gate/InvitationGate.tsx

import { useEffect, useMemo, useRef, useState } from "react";

import { useGateStore, wasGateAlreadyOpened } from "../../store/gateStore";
import type { GateProps } from "../../types";
import EnvelopeCover from "./EnvelopeCover";
import GateLoader from "./GateLoader";
import { GATE_IMAGE_SOURCES } from "./gateAssets";
import { useGateAssets } from "./useGateAssets";
import { useGateChoreography } from "./useGateChoreography";

/**
 * Envelope gate in front of the site. Holds the refs, waits on the gate images,
 * locks scrolling while closed, and unmounts each layer once its phase is past.
 * All state lives in the gate store — nothing is threaded through props.
 */
const GateStage = ({ children }: GateProps) => {
  const phase = useGateStore((state) => state.phase);

  const isRevealed = phase === "revealed";

  const overlayRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const leftFlapRef = useRef<HTMLDivElement>(null);
  const rightFlapRef = useRef<HTMLDivElement>(null);
  const leftShadowRef = useRef<HTMLDivElement>(null);
  const rightShadowRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);

  // Ref objects are stable, so this identity never changes.
  const refs = useMemo(
    () => ({
      overlay: overlayRef,
      loader: loaderRef,
      rightFlap: rightFlapRef,
      leftShadow: leftShadowRef,
      rightShadow: rightShadowRef,
      cover: coverRef,
      seal: sealRef,
      flash: flashRef,
      site: siteRef,
    }),
    [],
  );

  useGateAssets(GATE_IMAGE_SOURCES);
  useGateChoreography(refs);

  // No scrolling the site while it is still behind the cover.
  useEffect(() => {
    if (isRevealed) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isRevealed]);

  return (
    <>
      {/* `inert` keeps the gated site out of tab order and off screen readers */}
      <div
        ref={siteRef}
        inert={!isRevealed}
        className={isRevealed ? undefined : "gate-site"}
      >
        {children}
      </div>

      {!isRevealed && (
        <EnvelopeCover
          overlayRef={overlayRef}
          coverRef={coverRef}
          leftFlapRef={leftFlapRef}
          rightFlapRef={rightFlapRef}
          leftShadowRef={leftShadowRef}
          rightShadowRef={rightShadowRef}
          sealRef={sealRef}
          flashRef={flashRef}
        />
      )}

      {(phase === "loading" || phase === "intro") && (
        <GateLoader ref={loaderRef} />
      )}
    </>
  );
};

/**
 * Decides whether the gate runs at all. Once opened in this tab, later loads go
 * straight to the site — no loader, no envelope, no image preload, no scroll
 * lock. The store already starts at `revealed` in that case.
 */
const InvitationGate = ({ children }: GateProps) => {
  const [wasAlreadyOpened] = useState(wasGateAlreadyOpened);

  if (wasAlreadyOpened) return <>{children}</>;

  return <GateStage>{children}</GateStage>;
};

export default InvitationGate;
