// site/sections/VideoSection.tsx

import { useRef } from "react";

/** Full-height looping clip. Autoplay needs muted + playsInline on iOS. */
const VideoSection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="h-dvh w-full ">
      {/* the video container */}
      <div className="w-full h-dvh relative " ref={containerRef}>
        {/* the black overlay */}
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black opacity-50" />
        <video ref={videoRef} src="/dance-nile.mp4" className="absolute top-0 left-0 h-full  w-full object-cover" autoPlay muted loop playsInline preload="auto" aria-label="Dancing on the Nile" />

        {/* the content box */}
      </div>
    </section>
  );
};

export default VideoSection;
