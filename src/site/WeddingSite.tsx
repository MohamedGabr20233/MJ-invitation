// site/WeddingSite.tsx

import HeroSection from "./sections/Hero/HeroSection";
import TimerSection from "./sections/TimerSection";

/**
 * The full website behind the gate. Owns the site column width, so the gate
 * does not need to know anything about layout.
 *
 * TODO: split into src/site/sections/* (Hero, Story, Details, Gallery, Rsvp)
 * and src/site/layout/* (SiteNav, SiteFooter) as the real content lands.
 */
const WeddingSite = () => {
  return (
    <main className="mx-auto  w-full bg-[url('/blue-bg.png')] bg-repeat md:max-w-150">
      {/* the video section */}
      <HeroSection />
      <TimerSection />
    </main>
  );
};

export default WeddingSite;
