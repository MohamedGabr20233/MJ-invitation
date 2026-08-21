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

/* ── rsvp ───────────────────────────────────────────────────────────────────── */

/** The one question that matters, in the order the control renders it. */
export type RsvpAnswer = "yes" | "no";

/** What the form holds before it is sent. `photoFile` is the raw pick. */
export type RsvpDraft = {
  /**
   * The row this answer belongs to. The client mints it, because with no select
   * policy an insert cannot read its own id back — so `null` means "first send,
   * mint one" and a uuid means "update the answer already sitting there".
   */
  rsvpId: string | null;
  guestName: string;
  isAttending: boolean;
  /** Includes the person answering, so it is never below 1. Ignored on a "no". */
  guestCount: number;
  message: string;
  /** A fresh pick. `null` on a change of answer means "leave the photo alone". */
  photoFile: File | null;
  /**
   * The photo already on the row: carried through an update so it survives, or
   * `null` when they removed it and it should go.
   */
  photoPath: string | null;
};

/**
 * `invalid` is caught before the network call; `unavailable` covers a real
 * outage, missing env keys and an RLS rejection alike — from the guest's side
 * they are the same "not my problem" failure.
 */
export type RsvpSubmitResult = { status: "sent"; rsvpId: string; photoPath: string | null } | { status: "invalid"; hint: string } | { status: "unavailable" };

/**
 * The answer this browser already sent, kept in `localStorage` so a reload
 * shows the card and a change re-opens the form on the same row.
 */
export type SavedRsvp = {
  rsvpId: string;
  guestName: string;
  isAttending: boolean;
  guestCount: number;
  message: string;
  /** Object path in the bucket, so a re-opened form can show the photo again. */
  photoPath: string | null;
};

/** Drives which of the three faces the section shows. */
export type RsvpFormStatus = "idle" | "sending" | "sent" | "unavailable";

export type RsvpSuccessProps = {
  guestName: string;
  isAttending: boolean;
  /** Only read when attending, so the card can say who is coming with them. */
  guestCount: number;
  /** Re-opens the form on the same row. */
  onEdit: () => void;
  /** True once they have changed the answer at least once. */
  isUpdated: boolean;
};

export type RsvpPhotoPickerProps = {
  photoFile: File | null;
  /** Url of the photo already stored for this answer, shown until they replace it. */
  storedPhotoUrl: string | null;
  onPick: (photoFile: File | null) => void;
  /** Drops the stored photo, so the update clears `photo_path`. */
  onRemoveStored: () => void;
  /** Reports a rejected file so the form's single hint line can say why. */
  onReject: (hint: string) => void;
};

export type RsvpGuestStepperProps = {
  guestCount: number;
  onChange: (guestCount: number) => void;
};

/* ── /coming dashboard ──────────────────────────────────────────────────────── */

/** One row of `rsvp_responses`, snake_case as Postgres hands it over. */
export type RsvpResponseRow = {
  id: string;
  created_at: string;
  updated_at: string | null;
  guest_name: string;
  is_attending: boolean;
  guest_count: number;
  message: string | null;
  photo_path: string | null;
};

export type RsvpFeedResult = { status: "ok"; responses: RsvpResponseRow[] } | { status: "unavailable" };

/** The numbers across the top, all derived from the rows in one pass. */
export type RsvpAnalytics = {
  acceptedCount: number;
  declinedCount: number;
  responseCount: number;
  /** Everyone a "yes" brings, the person answering included. */
  totalPeople: number;
  messageCount: number;
  photoCount: number;
};

export type RsvpFeedStore = {
  responses: RsvpResponseRow[];
  isLoading: boolean;
  /** The store could not be read — same failure the RSVP form reports. */
  isUnavailable: boolean;
  load: () => Promise<void>;
};

export type StatCardProps = {
  label: string;
  value: number;
  /** Small line under the number, e.g. what it counts. */
  caption?: string;
  /** The two headline cards read louder than the strip underneath. */
  tone: "accepted" | "declined" | "neutral";
};

export type GuestCardProps = {
  response: RsvpResponseRow;
  isOpen: boolean;
  onToggle: () => void;
};

/** Which answers the list is showing. */
export type ComingFilter = "all" | "yes" | "no";
