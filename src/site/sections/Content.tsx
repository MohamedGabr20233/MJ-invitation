import HeroSplitter from "../../components/ui/HeroSplitter";
import { COUPLES_NAMES } from "../../constants";
import InviteDate from "./InviteDate";

const Content = () => {
  const { MALE, FEMALE } = COUPLES_NAMES;
  return (
    <section id="hero" className="w-full relative  max-w-90 z-20 h-full flex items-center flex-col pt-20">
      {/* the first text */}

      <p className="uppercase font-manrope text-xs tracking-[.3rem] text-white/90 ">Together with their families</p>
      {/* the split */}
      <HeroSplitter />

      {/* the name section */}

      <h1 className="text-6xl  pt-2 tracking-wider   text-white font-alex flex items-center flex-col">
        <p>{MALE}</p>
        <span className="text-4xl mb-5">&</span>
        <p>{FEMALE}</p>
      </h1>

      {/* second paragraph */}
      <p className="uppercase font-manrope text-xs tracking-[.3rem] text-white/90 pt-6 text-center leading-6 max-w-80 ">invite you to celebrate their beginning of their</p>

      <p className="  px-4 text-center w-fit font-alex text-white text-5xl pt-2 relative">
        forever <span className="absolute text-xl top-1 inset-e-0">♥</span>
      </p>

      <HeroSplitter />

      {/* the date */}
      <InviteDate />

      <HeroSplitter />

      <p className="  px-4 text-center w-fit font-alex text-white text-3xl placeholder-taupe-100 tracking-wider pt-2 relative">A new chapter begins</p>

      {/* at the bottom scroll section */}

      <div className="mt-auto text-center mb-10 font-manrope text-white tracking-widest">
        <p> Scroll Down </p>
        {/* arrow down button */}
        <span className="rotate-90 animate-pulse text-2xl block"> &gt; </span>
      </div>
    </section>
  );
};

export default Content;
