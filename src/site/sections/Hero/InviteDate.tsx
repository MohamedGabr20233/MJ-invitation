import { INVITATION_DATE } from "../../../constants";

const InviteDate = () => {
  const { day, month, year } = INVITATION_DATE;
  return (
    <>
      <p className=" ">{day}</p>
      {/* split */}
      <div className=" w-0.5 h-full bg-on-media" />
      <p>{month}</p>
      {/* split */}
      <div className=" w-0.5 h-full bg-on-media" />
      <p>{year}</p>
    </>
  );
};

export default InviteDate;
