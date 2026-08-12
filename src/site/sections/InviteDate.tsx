import { INVITATION_DATE } from "../../constants";

const InviteDate = () => {
  const { day, month, year } = INVITATION_DATE;
  return (
    <div className="text-white w-full text-lg max-w-70 ms-6 leading-0 h-4 flex items-center font-manrope tracking-widest justify-around">
      <p className=" ">{day}</p>
      {/* split */}
      <div className=" w-0.5 h-full bg-white" />
      <p>{month}</p>
      {/* split */}
      <div className=" w-0.5 h-full bg-white" />
      <p>{year}</p>
    </div>
  );
};

export default InviteDate;
