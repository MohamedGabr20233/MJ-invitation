// store/gateStore.ts

import { create } from "zustand";

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

/**
 * loading  → gate images still downloading, loader up
 * intro    → loader fading out, envelope fading in
 * sealed   → envelope up, waiting on the visitor
 * opening  → open sequence running
 * revealed → site owns the screen, gate gone
 */
export type GatePhase = "loading" | "intro" | "sealed" | "opening" | "revealed";

type GateStore = {
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

/**
 * The gate is one linear sequence, so it is one phase plus the transitions that
 * advance it. Every transition guards on the phase it comes from, which is what
 * makes a second click on the seal, or a re-fired effect, a no-op.
 *
 * Visitors who already opened the gate in this tab start at the end.
 */
export const useGateStore = create<GateStore>((set) => {
  const wasOpened = hasOpenedGate();

  return {
    phase: wasOpened ? "revealed" : "loading",
    progress: wasOpened ? 1 : 0,
    isSiteVisible: wasOpened,

    setProgress: (progress) => set({ progress }),

    assetsReady: () =>
      set((state) => (state.phase === "loading" ? { phase: "intro" } : state)),

    introDone: () =>
      set((state) => (state.phase === "intro" ? { phase: "sealed" } : state)),

    open: () =>
      set((state) => (state.phase === "sealed" ? { phase: "opening" } : state)),

    showSite: () => set({ isSiteVisible: true }),

    reveal: () =>
      set((state) => {
        if (state.phase !== "opening") return state;

        markGateOpened();
        return { phase: "revealed", isSiteVisible: true };
      }),
  };
});

/** True once the site is on screen, so media can start. */
export const useIsSiteVisible = () => useGateStore((state) => state.isSiteVisible);

/** Read outside the render cycle, e.g. when deciding to mount the gate at all. */
export const wasGateAlreadyOpened = hasOpenedGate;
