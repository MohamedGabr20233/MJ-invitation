// site/WeddingSite.tsx

/**
 * The full website behind the gate. Owns the site column width, so the gate
 * does not need to know anything about layout.
 *
 * TODO: split into src/site/sections/* (Hero, Story, Details, Gallery, Rsvp)
 * and src/site/layout/* (SiteNav, SiteFooter) as the real content lands.
 */
const WeddingSite = () => {
  return (
    <div className="mx-auto w-full bg-[#fffbed] lg:max-w-150">
      <section className="flex min-h-dvh flex-col items-center justify-center">
        <h1 className="text-4xl">Mohamed &amp; J</h1>

        <p className="mt-4">Wedding Invitation</p>
      </section>

      {/* TODO: remaining sections go here — this one only proves scrolling works */}
      <section className="flex min-h-dvh flex-col items-center justify-center">
        <p>Section two</p>
      </section>
    </div>
  );
};

export default WeddingSite;
