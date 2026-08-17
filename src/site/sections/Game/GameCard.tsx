import { useState } from "react";

const CARD_WIDTH = 190;

/** The card art ships as 190/380/570px webp variants so the browser never has to downscale a huge source. */
const cardSrcSet = (base: string) => [190, 380, 570].map((w) => `${base}-${w}.webp ${w}w`).join(", ");

// the game code

const GameCard = ({ className, backImage, alt, value }: { className?: string; backImage: string; alt: string; value: boolean }) => {
  const [flipped, setFlipped] = useState(false);
  console.log(value);

  return (
    // the card container
    // `card-wrap` is the entrance-animation handle — GSAP owns its transform, the
    // inner `.card` owns the flip transform, so the two never overwrite each other.
    <div onClick={() => setFlipped((prev) => !prev)} className={className || "card-wrap relative rounded-xl w-1/3 h-60 min-w-45 perspective-distant px-2"}>
      {/* the card */}
      <div
        className={` relative h-60 w-full cursor-pointer transition-transform
        duration-300 transform-3d will-change-transform  ${flipped ? "transform-[rotateY(180deg)]" : ""}
        `}
      >
        {/* the front */}
        <div className="absolute inset-0 backface-hidden">
          <img
            src={`/cards/rapunzel-play-card-${CARD_WIDTH}.webp`}
            srcSet={cardSrcSet("/cards/rapunzel-play-card")}
            sizes={`${CARD_WIDTH}px`}
            alt="play card"
            className="h-60 w-full rounded-xl object-cover"
          />
        </div>

        {/* the back */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
          <img src={`${backImage}-${CARD_WIDTH}.webp`} srcSet={cardSrcSet(backImage)} sizes={`${CARD_WIDTH}px`} alt={alt} className="h-60 w-full rounded-xl object-cover" />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
