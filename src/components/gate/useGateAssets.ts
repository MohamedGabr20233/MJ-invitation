// components/gate/useGateAssets.ts

import { useEffect } from "react";

import { useGateStore } from "../../store/gateStore";

/**
 * Preloads and decodes the gate images, reporting straight into the store: the
 * bar reads `progress`, and `assetsReady` starts the intro. Failed images still
 * count as settled, and a timeout keeps a stalled network from trapping the
 * visitor on the loader forever.
 */
export const useGateAssets = (
  sources: readonly string[],
  timeoutMs = 10_000,
) => {
  useEffect(() => {
    const { setProgress, assetsReady } = useGateStore.getState();

    if (sources.length === 0) {
      setProgress(1);
      assetsReady();
      return;
    }

    let isCancelled = false;
    let settledCount = 0;

    const settle = () => {
      if (isCancelled) return;

      settledCount += 1;
      setProgress(settledCount / sources.length);

      if (settledCount >= sources.length) assetsReady();
    };

    const images = sources.map((src) => {
      const image = new Image();

      image.onload = () => {
        // Decode ahead of paint — these PNGs are heavy enough to jank a phone.
        if (typeof image.decode === "function") {
          image.decode().catch(() => {}).then(settle);
          return;
        }

        settle();
      };

      image.onerror = settle;
      image.src = src;

      return image;
    });

    const timeoutId = window.setTimeout(() => {
      if (!isCancelled) assetsReady();
    }, timeoutMs);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);

      images.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [sources, timeoutMs]);
};
