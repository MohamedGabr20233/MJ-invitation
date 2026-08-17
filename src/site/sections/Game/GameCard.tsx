import { useState } from "react";

const GameCard = ({ className, backImage, alt, value }: { className?: string; backImage: string; alt: string; value: boolean }) => {
  const [flipped, setFlipped] = useState(false);
  console.log(value);
  return (
    // the card container
    <div onClick={() => setFlipped((prev) => !prev)} className={className || "relative rounded-xl w-1/3 h-60 min-w-45 perspective-distant px-2"}>
      {/* the card */}
      <div
        className={`relative h-60 w-full cursor-pointer transition-transform
        duration-700 transform-3d will-change-transform ${flipped ? "transform-[rotateY(180deg)]" : ""}
        `}
      >
        {/* the front */}
        <div className="absolute inset-0 backface-hidden">
          <img src="/rapunzel-play-card.png" alt="play card" width={1024} height={1536} className="h-60 w-full rounded-xl object-cover" />
        </div>

        {/* the back */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]">
          <img className="h-60 w-full rounded-xl object-cover" alt={alt} src={backImage} />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
