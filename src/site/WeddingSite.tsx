import DetailsSection from "./sections/DetailsSection";
import HeroSection from "./sections/Hero/HeroSection";
import TimerSection from "./sections/TimerSection";

const WeddingSite = () => {
  return (
    <main className="mx-auto  w-full bg-cream md:max-w-150">
      {/* the video section */}
      <HeroSection />
      <TimerSection />
      <DetailsSection />
    </main>
  );
};

export default WeddingSite;
