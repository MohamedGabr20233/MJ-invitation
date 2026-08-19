import type { CSSProperties } from "react";

/* One entry per lantern in flight.

   `rise` is the climb duration and also the swell duration — same clock, so the
   lantern is nearest the camera halfway up. `from`/`peak`/`to` are that depth
   pass: small and far at launch, past full size around the midpoint, small again
   as it goes away. `drift` is the sideways travel across the whole climb, `sway`
   the lantern's own rocking. */
const LANTERNS = [
  { src: "/lantern.png", left: "12%", width: "12.5rem", drift: "40px", delay: "1.5s", rise: "4s", sway: "4s", from: 0.5, peak: 1.15, to: 0.28 },
  { src: "/lantern-green.png", left: "4%", width: "10rem", drift: "-55px", delay: "1.6s", rise: "6s", sway: "5.2s", from: 0.6, peak: 1.35, to: 0.32 },
  { src: "/lantern-green.png", left: "34%", width: "15rem", drift: "30px", delay: "1.4s", rise: "3s", sway: "8.6s", from: 0.45, peak: 1.05, to: 0.25 },
  { src: "/lantern.png", left: "80%", width: "8.75rem", drift: "-30px", delay: "2.1s", rise: "4s", sway: "5.8s", from: 0.65, peak: 1.4, to: 0.35 },
  { src: "/lanterns.png", left: "48%", width: "10rem", drift: "-20px", delay: "1.8s", rise: "5s", sway: "4.2s", from: 0.55, peak: 1.1, to: 0.22 },
];

const GameSuccess = () => {
  return (
    /* `pointer-events-none` so the finished board underneath stays clickable. */
    <div className="pointer-events-none fixed top-0 left-1/2 z-9999 h-dvh w-full -translate-x-1/2 overflow-hidden md:max-w-150">
      {LANTERNS.map((lantern, i) => (
        /* Layer 1 — position: the climb plus sideways drift, one unbroken tween. */
        <div
          key={i}
          className="animate-lantern-rise absolute bottom-[-40%]"
          style={
            {
              left: lantern.left,
              width: lantern.width,
              animationDelay: lantern.delay,
              animationDuration: lantern.rise,
              "--lantern-drift": lantern.drift,
            } as CSSProperties
          }
        >
          {/* Layer 2 — depth: the near/far swell. Kept off layer 1 because its
              middle keyframe would otherwise cut the climb into uneven segments. */}
          <div
            className="animate-lantern-swell w-full"
            style={
              {
                animationDelay: lantern.delay,
                animationDuration: lantern.rise,
                "--lantern-scale-from": lantern.from,
                "--lantern-scale-peak": lantern.peak,
                "--lantern-scale-to": lantern.to,
              } as CSSProperties
            }
          >
            {/* Layer 3 — the lantern's own rocking, on its own loop. */}
            <img src={lantern.src} alt="" aria-hidden className="animate-lantern-sway w-full" style={{ animationDuration: lantern.sway, animationDelay: lantern.delay }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameSuccess;
