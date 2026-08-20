// site/sections/VideoSection.tsx

import { useEffect, useRef } from "react";

import { useIsSiteVisible } from "../../../store/gateStore";
import Content from "./Content";

/**
 * Full-height looping clip. Autoplay needs muted + playsInline on iOS.
 *
 * No `autoPlay` attribute: behind the gate that would burn through the clip
 * while nobody can see it. It starts from the top the moment the cover drops.
 */
const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isSiteVisible = useIsSiteVisible();

  useEffect(() => {
    if (!isSiteVisible) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    // Muted playback off the back of a click, so this should not be blocked —
    // and if a browser blocks it anyway, the poster frame just sits there.
    video.play().catch(() => {});
  }, [isSiteVisible]);

  return (
    <section className="min-h-dvh h-fit w-full ">
      {/* the video container */}
      <div className="w-full  min-h-dvh relative flex justify-center" ref={containerRef}>
        {/* the black overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-scrim opacity-50" />
        <video ref={videoRef} src="/Rapunzel-Song.mp4" className="absolute top-0 left-0 h-full  w-full object-cover" muted loop playsInline preload="auto" aria-label="Dancing on the Nile" />

        {/* the content box */}
        <Content />
      </div>
    </section>
  );
};

export default HeroSection;
