import { INVITATION_DATE } from "../../constants";

const RsvpSection = () => {
  return (
    <section id="rsvp" className="w-full  flex flex-col items-center  ">
      {/* the section title  */}
      <div className="w-full flex flex-col items-center rounded-lg bg-[#CFE5FE]/40 ">
        <img src="RSVP.png" alt="rsvp section image" className="w-60" />
      </div>
    </section>
  );
};

export default RsvpSection;
