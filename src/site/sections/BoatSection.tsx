import { InvitationLocations } from "../../constants";
import { useRevealOnView } from "../../lib/useRevealOnView";

const BoatSection = () => {
  useRevealOnView(
    "#boat",
    ".reveal-in",
    {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.4,
    },
    { rootMargin: "0px 0px -30% 0px" },
  );

  useRevealOnView(
    "#map",
    ".badge-location",
    {
      opacity: 0,
      x: 20,
      duration: 1,
      stagger: 0.4,
    },
    { rootMargin: "0px 0px -20% 0px" },
  );

  useRevealOnView(
    "#map",
    ".badge-name",
    {
      opacity: 0,
      x: -20,
      duration: 1,
      stagger: 0.4,
    },
    { rootMargin: "0px 0px -20% 0px" },
  );
  return (
    <section id="boat" className=" flex justify-start items-center px-4  flex-col pb-20 ">
      {/* the rapunzel logo */}
      <img src="/sun.png" alt="tangled-sun" className="reveal-in  h-30 rotate-90 skew-1" />

      {/* the section title */}
      <h2 className="text-primary font-bold font-alex tracking-wider text-3xl  reveal-in ">We will be waiting you at</h2>
      {/* the boat image */}

      <div className="relative" id="map">
        <img src="/boat.jpeg" className=" h-full w-full  object-cover mt-10 [clip-path:polygon(0_10%,100%_0,100%_90%,0_100%)]" alt="boat img" />
        {/* the location badge */}
        <div className="absolute  top-0 left-0    rotate-10 w-full badge-location">
          <img src="/map-paper.png" className="w-110   top-0  -translate-x-1/4" alt="location" />
          <a
            className="absolute  left-17 p-0 w-40 h-20 flex items-center justify-center top-19  -rotate-1 max-[300px]:top-17 max-[300px]:left-6  max-[340px]:top-22 max-[340px]:left-12  max-[300px]:text-base text-on-media text-xl font-cormorant font-bold uppercase  z-999 "
            target="_blank"
            href={InvitationLocations.link}
          >
            OPEN MAP
          </a>
        </div>

        {/* the place name patch */}
        <div className="absolute  badge-name top-6  max-md:top-12  left-42 max-md:left-35 [clip-path:polygon(0_28%,100%_28%,100%_100%,0_100%)] px-2  z-10  -rotate-10 w-full">
          {/* the white badge */}
          <img src="/white-paper.png" className="w-60       -translate-x-1/4" alt="location" />
          <p className="absolute top-15 font-alex font-bold  text-primary text-lg left-2">Paradise Yacht</p>
        </div>
      </div>

      {/* <div className="flex items-center justify-around">
        <p className=" pt-10 text-2xl font-bold text-primary font-times">Paradise Yacht</p>
        {/* the location badge 
        
      </div> */}
    </section>
  );
};

export default BoatSection;
