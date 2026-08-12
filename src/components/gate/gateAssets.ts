// components/gate/gateAssets.ts

/** Every image the gate needs before it can be shown. */
export const GATE_IMAGES = {
  leftFlap: "/letter-left.png",
  rightFlap: "/letter-right2.png",
  seal: "/button.png",
} as const;

/** Stable array identity — used as a hook dependency. */
export const GATE_IMAGE_SOURCES: readonly string[] = Object.values(GATE_IMAGES);
