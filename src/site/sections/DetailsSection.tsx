import { CalendarDays, Clock, MapPinned } from "lucide-react";
import HeartIcon from "../../components/icons/HeartIcon";
import DetailsFrame from "../../components/ui/DetailsFrame";
import { INVITATION_DATE, InvitationLocations } from "../../constants";

const DetailsSection = () => {
  return (
    <section id="details" className="flex gap-20  items-center flex-col text-ink  pb-30">
      {/* the frame */}
      <DetailsFrame>
        <div className="flex flex-col items-center w-full max-w-[60%] text-center">
          <p className=" py-2.5 pb-0  font-extrabold font-times text-sm uppercase tracking-[.2rem]"> Our story</p>
          {/* the heart icon  */}
          <HeartIcon className="mx-auto my-2  h-6 w-6" />

          <p className="font-thuluth text-center leading-9  text-3xl">
            <span> .. من صدفة </span>
            <br />
            <span>الي حكايه عمر</span>
          </p>

          <img src="/map-love.png" alt="the love map img" className=" pt-3 w-[80%]" />
        </div>
      </DetailsFrame>
      {/* the weeding details */}
      <DetailsFrame>
        {" "}
        <div className="flex flex-col items-center w-full max-w-[70%] text-center">
          <p className=" py-2.5 pb-0  font-extrabold font-times text-sm  uppercase tracking-[.2rem]">The big day details</p>

          {/* the date */}
          <div className="w-full flex justify-start items-center gap-4 text-start pt-10">
            <CalendarDays className="  h-6 w-6 text-ink" />
            <p className="font-bold">
              {INVITATION_DATE.year} / {INVITATION_DATE.month} / {INVITATION_DATE.day}
            </p>
          </div>
          <div className="w-full flex justify-start items-center gap-4 text-start pt-4">
            <Clock className="  h-6 w-6 text-ink" />
            <p className="font-bold">{INVITATION_DATE.hour12}</p>
          </div>

          <div className="w-full flex justify-start items-center gap-4 text-start pt-4">
            <MapPinned className="  h-6 w-6 text-ink" />
            <p className="font-bold">{InvitationLocations.labelShort}</p>
          </div>
        </div>
      </DetailsFrame>
    </section>
  );
};

export default DetailsSection;
