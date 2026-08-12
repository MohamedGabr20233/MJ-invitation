// components/gate/InvitationGate.tsx

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import EnvelopeCover from "./EnvelopeCover";
import GateLoader from "./GateLoader";
import { GATE_IMAGE_SOURCES } from "./gateAssets";
import { useEnvelopeAnimation } from "./useEnvelopeAnimation";
import { useGateAssets } from "./useGateAssets";

const STORAGE_KEY = "invite:opened";

// Storage access is wrapped — Safari private mode throws on sessionStorage.
const hasOpenedGate = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const markGateOpened = () => {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Non-fatal: the gate just shows again on the next load.
  }
};

type GateProps = {
  children: ReactNode;
};

/**
 * Envelope gate in front of the site. Holds the refs, waits on the gate images,
 * locks scrolling while closed, and unmounts each layer once it is done.
 */
const GateStage = ({ children }: GateProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoaderMounted, setIsLoaderMounted] = useState(true);

  const { isReady, progress } = useGateAssets(GATE_IMAGE_SOURCES);

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

  const handleIntroDone = useCallback(() => setIsLoaderMounted(false), []);

  const handleOpened = useCallback(() => {
    setIsRevealed(true);
    markGateOpened();
  }, []);

  const { playIntro, open } = useEnvelopeAnimation(refs, {
    onIntroDone: handleIntroDone,
    onOpened: handleOpened,
  });

  // Images decoded → cross-fade the loader out and the envelope in.
  useEffect(() => {
    if (isReady) playIntro();
  }, [isReady, playIntro]);

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
      <div ref={siteRef} inert={!isRevealed}>
        {children}
      </div>

      {!isRevealed && (
        <EnvelopeCover
          onOpen={open}
          isInteractive={isReady}
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

      {isLoaderMounted && <GateLoader progress={progress} ref={loaderRef} />}
    </>
  );
};

/**
 * Decides whether the gate runs at all. Once opened in this tab, later loads
 * go straight to the site — no loader, no envelope, no GSAP, no scroll lock.
 */
const InvitationGate = ({ children }: GateProps) => {
  const [wasAlreadyOpened] = useState(hasOpenedGate);

  if (wasAlreadyOpened) return <>{children}</>;

  return <GateStage>{children}</GateStage>;
};

export default InvitationGate;
