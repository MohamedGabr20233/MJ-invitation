import { CalendarDays, Clock, MapPinned } from "lucide-react";
import HeartIcon from "../../components/icons/HeartIcon";
import DetailsFrame from "../../components/ui/DetailsFrame";
import { INVITATION_DATE, InvitationLocations } from "../../constants";
import { useRevealOnView } from "../../lib/useRevealOnView";

const DetailsSection = () => {
  useRevealOnView(
    "#frame-1",
    ".frame-body",
    {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1,
    },
    { rootMargin: "0px 0px -50% 0px" },
  );

  useRevealOnView(
    "#frame-2",
    ".frame-body",
    {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1,
    },
    { rootMargin: "0px 0px -50% 0px" },
  );
  return (
    <section id="details" className="flex gap-30  items-center flex-col text-primary  pb-20">
      {/* the frame */}
      <div id="frame-1">
        <DetailsFrame className="frame-body">
          <div className="frame-body flex flex-col items-center w-full max-w-[70%] text-center">
            <p className="frame-body py-2.5 pb-0 pt-6 font-extrabold font-times text-base uppercase tracking-[.2rem]"> Our story</p>
            {/* the heart icon  */}
            <HeartIcon className="frame-body mx-auto my-2  h-6 w-6" />

            <p className="frame-body font-thuluth text-center leading-9  text-3xl">
              <span> .. من صدفة </span>
              <br />
              <span>الي حكايه عمر</span>
            </p>

            <img src="/map-love.png" alt="the love map img" className="frame-body pt-3 w-[80%]" />
          </div>
        </DetailsFrame>
      </div>
      {/* the weeding details */}
      <div id="frame-2">
        <DetailsFrame className="frame-body">
          {" "}
          <div className="flex frame-body flex-col items-center w-full max-w-[70%] text-center">
            <p className="frame-body py-2.5 pt-6 pb-0  font-extrabold font-times text-base  uppercase tracking-[.2rem]">The big day details</p>

            {/* the date */}
            <div className="frame-body w-full flex justify-start items-center gap-4 text-start pt-10">
              <CalendarDays className="  h-6 w-6 text-primary" />
              <p className="font-bold text-lg">
                {INVITATION_DATE.year} / {INVITATION_DATE.month} / {INVITATION_DATE.day}
              </p>
            </div>
            <div className="w-full frame-body flex justify-start items-center gap-4 text-start pt-4">
              <Clock className="  h-6 w-6 text-primary" />
              <p className="font-bold text-lg">{INVITATION_DATE.time}</p>
            </div>

            <div className="w-full frame-body flex justify-start items-center gap-4 text-start pt-4">
              <MapPinned className="  h-6 w-6 text-primary" />
              <p className="font-bold text-lg">{InvitationLocations.labelShort}</p>
            </div>
          </div>
        </DetailsFrame>
      </div>
    </section>
  );
};

export default DetailsSection;
