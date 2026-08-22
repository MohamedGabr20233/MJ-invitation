// components/ui/MusicToggle.tsx

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

import { BACKGROUND_MUSIC, MUSIC_STORAGE_KEY } from "../../constants";
import { useGateStore } from "../../store/gateStore";
import type { MusicState } from "../../types";

// Storage access is wrapped — Safari private mode throws on localStorage.
const wasMutedLastTime = () => {
  try {
    return localStorage.getItem(MUSIC_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const rememberMuted = (isMuted: boolean) => {
  try {
    localStorage.setItem(MUSIC_STORAGE_KEY, isMuted ? "1" : "0");
  } catch {
    // Non-fatal: the choice just does not survive a reload.
  }
};

/**
 * The song, and the one control for it — a disc in the bottom corner that turns
 * while it plays and stops when it is muted.
 *
 * Start is tied to `opening`, not `revealed`: that phase is set inside the click
 * on the wax seal, so `play()` runs while the browser still counts the tap as
 * user activation. Waiting for the reveal would put a second and a third of
 * animation between the gesture and the call, which Safari can refuse.
 *
 * Mounted outside the gate, so the gate's transform on the site column cannot
 * drag a `fixed` button around mid-reveal.
 */
const MusicToggle = () => {
  const hasStarted = useGateStore((state) => state.phase === "opening" || state.isSiteVisible);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<MusicState>("muted");

  useEffect(() => {
    const audio = audioRef.current;
    if (!hasStarted || !audio || wasMutedLastTime()) return;

    audio.volume = BACKGROUND_MUSIC.volume;

    // A refusal is normal — a reopened tab has no gesture behind it. The disc
    // then sits still and the first tap starts the song.
    audio
      .play()
      .then(() => setState("playing"))
      .catch(() => setState("muted"));
  }, [hasStarted]);

  // The gate owns the screen until it lifts; a control under it is unreachable.
  if (!hasStarted) return null;

  const isPlaying = state === "playing";

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setState("muted");
      rememberMuted(true);
      return;
    }

    audio.volume = BACKGROUND_MUSIC.volume;
    // This one is always inside a tap, so it cannot be refused for autoplay.
    void audio.play().then(() => setState("playing"));
    rememberMuted(false);
  };

  return (
    <>
      <audio ref={audioRef} src={BACKGROUND_MUSIC.src} loop preload="auto" />

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Mute the music" : "Play the music"}
        aria-pressed={isPlaying}
        className="music-in fixed bottom-5 right-5 z-50 grid size-17 place-items-center rounded-full border-2 border-secondary bg-primary text-on-media shadow-card transition-transform duration-200 active:scale-90"
      >
        {/* Only the icon turns. The button keeps its box, so the tap target
            never moves and nothing around it is asked to re-layout. */}
        <span aria-hidden="true" className={`music-disc grid place-items-center ${isPlaying ? "" : "music-disc-paused"}`}>
          {isPlaying ? <Music className="size-7" /> : <VolumeX className="size-7" />}
        </span>
      </button>
    </>
  );
};

export default MusicToggle;
