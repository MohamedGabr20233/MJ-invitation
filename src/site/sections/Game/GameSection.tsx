import { GAME_CARD_CONTENT } from "../../../constants";
import GameCard from "./GameCard";
import { gsap, useGSAP } from "../../../lib/gsap";

const GameSection = () => {
  useGSAP(
    () => {
      const cards = gsap.from(".card-wrap", { y: 40, opacity: 0, stagger: 0.15, paused: true });

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Fires once on observe() with the current state, hence the guard.
          if (!entry.isIntersecting) return;

          observer.disconnect();
          cards.play();
        },
        // Shrinking the viewport's bottom edge is the IO spelling of "top 80%".
        { rootMargin: "0px 0px -20% 0px" },
      );

      observer.observe(document.getElementById("game")!);

      return () => observer.disconnect();
    },
    { scope: "#game" },
  );
  return (
    <section id="game" className=" relative flex justify-start items-center px-4  flex-col pb-20 ">
      {/* the lantern img */}
      <img src="/rapunzel-lantern-duo.png" alt="rapunzel lantern img" className="absolute -top-30  -right-2 w-45" />
      {/* the section title */}
      <h2 className="text-ink font-bold font-alex tracking-wider  text-3xl  ">Play With Us</h2>

      {/* the description */}
      <p className="w-full pt-4 font-sans  font-bold text-neutral-700 ">♦ flip the matched cards</p>

      {/* the card img */}
      {/* the 3 cards */}
      <div className="flex flex-wrap items-center justify-around gap-y-4 h-fit pt-5">
        {GAME_CARD_CONTENT.map((card, i) => (
          <GameCard alt={card.alt} backImage={card.userImage} value={card.value} key={i} />
        ))}
      </div>
    </section>
  );
};

export default GameSection;
