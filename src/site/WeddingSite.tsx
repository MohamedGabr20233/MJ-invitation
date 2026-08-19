import BoatSection from "./sections/BoatSection";
import DetailsSection from "./sections/DetailsSection";
import GameSection from "./sections/Game/GameSection";
import HeroSection from "./sections/Hero/HeroSection";
import TimerSection from "./sections/TimerSection";

const WeddingSite = () => {
  return (
    <main className="mx-auto relative  w-full bg-cream md:max-w-150 overflow-hidden">
      {/* the video section */}
      <HeroSection />
      <TimerSection />
      <DetailsSection />
      {/* the boat section */}
      <BoatSection />
      <GameSection />
    </main>
  );
};

export default WeddingSite;
