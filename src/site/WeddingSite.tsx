import BoatSection from "./sections/BoatSection";
import DetailsSection from "./sections/DetailsSection";
import Footer from "./sections/Footer";
import GameSection from "./sections/Game/GameSection";
import HeroSection from "./sections/Hero/HeroSection";
import RsvpSection from "./sections/RsvpSection";
import TimerSection from "./sections/TimerSection";

const WeddingSite = () => {
  return (
    <main className="mx-auto relative  w-full bg-surface md:max-w-150 overflow-hidden">
      {/* the video section */}
      <HeroSection />
      <TimerSection />
      <DetailsSection />
      {/* the boat section */}
      <BoatSection />
      <GameSection />
      <RsvpSection />
      <Footer />
    </main>
  );
};

export default WeddingSite;
