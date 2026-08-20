// types.ts — every shared type in the app. Kept beside constants.ts so a component
// file is only components and a hook file is only behaviour.

import type { ReactNode, Ref, RefObject } from "react";

/* ── gate store ─────────────────────────────────────────────────────────── */

/**
 * loading  → gate images still downloading, loader up
 * intro    → loader fading out, envelope fading in
 * sealed   → envelope up, waiting on the visitor
 * opening  → open sequence running
 * revealed → site owns the screen, gate gone
 */
export type GatePhase = "loading" | "intro" | "sealed" | "opening" | "revealed";

export type GateStore = {
  phase: GatePhase;
  /** 0 → 1, for the loader bar. */
  progress: number;
  /** True from the moment the cover drops — media behind the gate waits on it. */
  isSiteVisible: boolean;

  setProgress: (progress: number) => void;
  assetsReady: () => void;
  introDone: () => void;
  open: () => void;
  showSite: () => void;
  reveal: () => void;
};

/* ── gate choreography ──────────────────────────────────────────────────── */

export type ElementRef = RefObject<HTMLElement | null>;

export type GateRefs = {
  /** Overlay root — owns the 3d perspective and the intro fade. */
  overlay: ElementRef;
  /** Loading screen shown until the gate images are decoded. */
  loader: ElementRef;
  /** Flap that swings open. */
  rightFlap: ElementRef;
  leftShadow: ElementRef;
  rightShadow: ElementRef;
  /** Wraps both flaps, hidden once the site is revealed. */
  cover: ElementRef;
  /** Wax seal, slides off before the flap moves. */
  seal: ElementRef;
  /** White flash that masks the cover → site swap. */
  flash: ElementRef;
  /** The site behind the gate. Lives outside the overlay. */
  site: ElementRef;
};

/* ── gate components ────────────────────────────────────────────────────── */

export type GateProps = {
  children: ReactNode;
};

// Refs are passed one prop each, not bundled in an object — reading
// `props.refs.x` in JSX counts as a ref access during render.
export type EnvelopeCoverProps = {
  overlayRef: Ref<HTMLDivElement>;
  coverRef: Ref<HTMLDivElement>;
  leftFlapRef: Ref<HTMLDivElement>;
  rightFlapRef: Ref<HTMLDivElement>;
  leftShadowRef: Ref<HTMLDivElement>;
  rightShadowRef: Ref<HTMLDivElement>;
  sealRef: Ref<HTMLDivElement>;
  flashRef: Ref<HTMLDivElement>;
};

export type EnvelopeFlapProps = {
  side: "left" | "right";
  /** Half of the letter artwork, rendered at 200% width and cropped. */
  image: string;
  ref?: Ref<HTMLDivElement>;
  /** Ref for the fold shadow overlay, animated by the gate classes. */
  shadowRef?: Ref<HTMLDivElement>;
};

export type GateLoaderProps = {
  ref?: Ref<HTMLDivElement>;
};

export type WaxButtonProps = {
  /** Animated by the gate classes — a node nothing else transforms. */
  ref?: Ref<HTMLDivElement>;
};

/* ── countdown ──────────────────────────────────────────────────────────── */

export type CountdownPhase = "before" | "today" | "after";

export type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  phase: CountdownPhase;
};

/* ── memory game ────────────────────────────────────────────────────────── */

export type GameCardProps = {
  className?: string;
  backImage: string;
  alt: string;
  /** Face-up state lives in GameSection — a mismatch has to be able to turn this card back down. */
  flipped: boolean;
  /** How many times this card has turned. Only feeds the rotation, so the spin always goes forward. */
  turns: number;
  /** Part of the winning pair: stays face up and gets the ring. */
  matched?: boolean;
  onSelect: () => void;
};

export type GameStatusProps = {
  /** The pair has been found. */
  solved: boolean;
  /** Wrong pairs so far — a new value replays the shake. */
  misses: number;
};

/* ── shared ui ──────────────────────────────────────────────────────────── */

/** Decorative svg that only takes styling. */
export type IconProps = {
  className?: string;
};

export type DetailsFrameProps = {
  children?: ReactNode;
  className?: string;
};

/* ── reveal hook ────────────────────────────────────────────────────────── */

export type RevealOptions = {
  /** Detection box vs the viewport. The default shrinks the bottom edge by 20%, i.e. ScrollTrigger's "top 80%". */
  rootMargin?: string;
};
