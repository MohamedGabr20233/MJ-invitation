// components/gate/useGateAssets.ts

import { useEffect, useState } from "react";

/**
 * Preloads and decodes the gate images so the envelope never paints half-drawn
 * on a slow phone. Failed images still count as settled, and a timeout keeps a
 * stalled network from trapping the visitor on the loader forever.
 */
export const useGateAssets = (
  sources: readonly string[],
  timeoutMs = 10_000,
) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(sources.length === 0);

  useEffect(() => {
    if (sources.length === 0) return;

    let isCancelled = false;
    let settledCount = 0;

    const settle = () => {
      if (isCancelled) return;

      settledCount += 1;
      setLoadedCount(settledCount);

      if (settledCount >= sources.length) setIsReady(true);
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
      if (!isCancelled) setIsReady(true);
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

  return {
    isReady,
    /** 0 → 1, for the loader bar. */
    progress: sources.length === 0 ? 1 : loadedCount / sources.length,
  };
};
