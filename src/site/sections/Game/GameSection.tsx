import { useEffect, useRef, useState } from "react";
import { GAME_CARD_CONTENT } from "../../../constants";
import GameCard from "./GameCard";
import GameStatus from "./GameStatus";
import GameSuccess from "./GameSuccess";
import { useRevealOnView } from "../../../lib/useRevealOnView";

/** How long a wrong pair stays face up before it turns back down. */
const MISMATCH_HOLD = 1500;

const GameSection = () => {
  useRevealOnView("#game", ".card-wrap", {
    transformPerspective: 800,
    z: 40,
    y: 20,
    opacity: 0,
    duration: 0.9,
    stagger: 0.18,
    ease: "power3.out",
  });

  useRevealOnView("#game", ".reval-in", {
    y: 10,
    opacity: 0,
    duration: 0.5,
    stagger: 0.18,

    ease: "power1.inOut",
  });
  /** Indices of the cards currently face up — at most two until the pair is found. */
  const [selected, setSelected] = useState<number[]>([]);
  /** Per-card turn count, so each card's spin keeps going forward instead of unwinding. */
  const [turns, setTurns] = useState<number[]>(() => GAME_CARD_CONTENT.map(() => 0));
  const [solved, setSolved] = useState(false);
  /** Set while a wrong pair is on show, so the third card can't be clicked mid-reset. */
  const [locked, setLocked] = useState(false);
  /** Wrong pairs so far. `> 0` is "they got it wrong at least once", which is what the hint reads. */
  const [misses, setMisses] = useState(0);

  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (resetTimer.current && clearTimeout(resetTimer.current)), []);

  const bumpTurns = (indices: number[]) => setTurns((prev) => prev.map((count, i) => (indices.includes(i) ? count + 1 : count)));

  const select = (index: number) => {
    if (solved || locked || selected.includes(index)) return;

    const next = [...selected, index];
    setSelected(next);
    bumpTurns([index]);

    if (next.length < 2) return;

    // The pair is the two cards flagged `value: true` — the bride and the groom.
    if (next.every((i) => GAME_CARD_CONTENT[i].value)) {
      setSolved(true);
      return;
    }

    // Wrong pair: hold it long enough to read, then turn both back down.
    setMisses((count) => count + 1);
    setLocked(true);
    resetTimer.current = setTimeout(() => {
      setSelected([]);
      bumpTurns(next);
      setLocked(false);
    }, MISMATCH_HOLD);
  };

  return (
    <section id="game" className=" z-10 relative flex justify-start items-center px-4  flex-col pb-10 ">
      {/* the lantern img */}
      <img src="/rapunzel-lantern-duo.png" alt="rapunzel lantern img" className="absolute reval-in -top-30  -right-2 w-45" />
      {/* the section title */}
      <h2 className="text-primary reval-in font-bold font-alex tracking-wider  text-3xl  ">Play With Us</h2>

      {/* the description — doubles as the game's only feedback */}
      <p className="reval-in w-full pt-4 font-sans  font-bold text-muted ">{"♦ flip the matched cards"}</p>

      {/* the card img */}
      {/* the 3 cards */}
      <div className="flex flex-wrap items-center justify-around gap-y-4 h-fit pt-5">
        {GAME_CARD_CONTENT.map((card, i) => (
          <GameCard alt={card.alt} backImage={card.userImage} flipped={selected.includes(i)} turns={turns[i]} matched={solved && selected.includes(i)} onSelect={() => select(i)} key={card.id} />
        ))}
      </div>

      {/* status line — only speaks once there is something to say */}
      <GameStatus solved={solved} misses={misses} />

      {/* The reward. Mounting is what starts the lanterns — the CSS animation
          runs on first paint, so this must not be in the tree before the win. */}
      {solved && <GameSuccess />}
    </section>
  );
};

export default GameSection;
