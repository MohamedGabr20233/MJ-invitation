import { InvitationLocations } from "../../../constants";

const BoatSection = () => {
  return (
    <section id="boat" className="r flex justify-start items-center px-4  flex-col pb-20 ">
      {/* the rapunzel logo */}
      <img src="/sun.png" alt="tangled-sun" className="  h-30 rotate-90 skew-1" />

      {/* the section title */}
      <h2 className="text-ink font-bold font-alex tracking-wider text-3xl  ">We will be waiting you at</h2>
      {/* the boat image */}

      <div className="relative">
        <img src="/boat.jpeg" className=" h-full w-full  object-cover mt-10 [clip-path:polygon(0_10%,100%_0,100%_90%,0_100%)]" alt="boat img" />
        {/* the location badge */}
        <div className="absolute  top-0 left-0   rotate-10 w-full">
          <img src="/location-paper.png" className="w-110   top-0  -translate-x-1/4" alt="location" />
          <div className="absolute  left-15  top-26 -rotate-1 max-[300px]:top-17 max-[300px]:left-6  max-[340px]:top-22 max-[340px]:left-12  max-[300px]:text-base text-white text-xl font-cormorant font-bold uppercase">
            <a className=" px-10 py-5 " href={InvitationLocations.link}>
              {" "}
              OPEN MAP
            </a>
          </div>
        </div>

        {/* the place name patch */}
        <div className="absolute  top-14 left-40   -rotate-10 w-full">
          {/* the white badge */}
          <img src="/white-paper.png" className="w-60      -translate-x-1/4" alt="location" />
          <p className="absolute top-15 font-alex font-bold  text-ink text-lg left-0">Paradise Yacht</p>
        </div>
      </div>

      {/* <div className="flex items-center justify-around">
        <p className=" pt-10 text-2xl font-bold text-ink font-times">Paradise Yacht</p>
        {/* the location badge 
        
      </div> */}
    </section>
  );
};

export default BoatSection;
