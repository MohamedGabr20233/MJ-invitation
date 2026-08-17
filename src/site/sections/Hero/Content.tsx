import HeroSplitter from "../../../components/ui/HeroSplitter";
import { COUPLES_NAMES } from "../../../constants";
import InviteDate from "./InviteDate";
import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "../../../lib/gsap";
import { useIsSiteVisible } from "../../../store/gateStore";

const Content = () => {
  const { MALE, FEMALE } = COUPLES_NAMES;
  const firstPartRef = useRef<HTMLDivElement | null>(null);
  const inviteRef = useRef<HTMLParagraphElement | null>(null);
  const isSiteVisible = useIsSiteVisible();
  useGSAP(() => {
    if (!isSiteVisible) return;

    // Words, not chars: the line is small caps with wide tracking, and per-letter
    // at that size reads as flicker rather than as a reveal.
    const invite = SplitText.create(inviteRef.current, { type: "chars" });

    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut", duration: 0.6 } });

    //   the name animation group
    timeline
      //   this first part is the "Together with their families" and the split text
      .to(firstPartRef.current, { opacity: 1, y: 0, delay: 0.5 })
      .from(invite.chars, { opacity: 0, duration: 0.2, delay: 1, stagger: 0.05 })
      .to(".reveal", { opacity: 1, y: 0, delay: 0, stagger: 0.05 })
      .to(".scrollAnimation", { opacity: 1, y: 0, duration: 1, ease: "power2.inOut" });

    gsap.to(".nameAnimate", { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.inOut", delay: 1.5 });
    gsap.to("#And", { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.inOut", delay: 1.5 });
    // useGSAP reverts its own tweens; the split's wrapper spans are ours to undo.
    return () => invite.revert();
  }, [isSiteVisible]);

  return (
    <section id="hero" className="w-full relative  max-w-98 z-20  flex items-center  flex-col pt-20 max-sm:pt-10">
      {/* the first text */}

      <div ref={firstPartRef} className=" translate-y-5 opacity-0">
        <p className="uppercase font-manrope text-xs tracking-[.3rem] text-white/90 ">Together with their families</p>
        {/* the split */}
        <HeroSplitter />
      </div>

      {/* the name section */}

      <h1 className="text-[5rem]  pt-2 tracking-wider   text-white font-alex flex items-center flex-col">
        <p className="nameAnimate overflow-hidden translate-y-10 opacity-0">{MALE}</p>
        <span className="text-4xl mb-5  translate-y-5 opacity-0" id="And">
          &
        </span>
        <p className="nameAnimate overflow-hidden translate-y-10 opacity-0">{FEMALE}</p>
      </h1>

      <p ref={inviteRef} className="uppercase font-manrope text-base tracking-[.3rem] text-white/90 pt-6 text-center leading-6  max-w-98 ">
        invite you to celebrate their beginning of their
      </p>

      <p className=" reveal opacity-0 px-4 text-center w-fit font-alex text-white text-5xl pt-4 relative">
        forever <span className="absolute text-xl top-3 inset-e-0">♥</span>
      </p>

      {/* the date */}
      <div className="   text-white w-full text-lg  leading-0 flex-col flex items-center font-manrope  justify-around">
        <div className="w-full reveal translate-y-7 opacity-0 ">
          <HeroSplitter />
        </div>

        <div className=" reveal translate-y-7  opacity-0  flex w-full items-center justify-around h-4 ms-7 max-w-70 ">
          <InviteDate />
        </div>

        <div className="w-full reveal translate-y-7 opacity-0 ">
          <HeroSplitter />
        </div>
      </div>

      <p className="  reveal opacity-0 px-4 text-center w-fit font-alex text-white text-3xl placeholder-taupe-100 tracking-wider pt-2 relative">A new chapter begins</p>

      {/* at the bottom scroll section */}

      <div className="reveal pt-20 overflow-hidden   text-center mb-10 font-manrope text-white tracking-widest">
        <div className="opacity-0   scrollAnimation translate-y-4">
          <p> Scroll Down </p>
          {/* arrow down button */}
          <span className="rotate-90 animate-pulse  text-2xl block"> &gt; </span>
        </div>
      </div>
    </section>
  );
};

export default Content;
