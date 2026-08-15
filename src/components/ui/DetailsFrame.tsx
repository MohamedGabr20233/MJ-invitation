import React from "react";

const DetailsFrame = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex items-center pt-7 flex-col gap-1 w-70 min-h-90  pb-5 relative h-fit">
      {/* the frame image */}
      <img src="/frame-blue.png" className=" [clip-path:polygon(0_0,100%_0,100%_90%,0_90%)] w-full top-0 left-0 absolute h-auto" alt="frame img" loading="lazy" />
      {children}
      {/* the roses image */}
      <img src="/roses-blue.png" className=" absolute w-full scale-110 -bottom-15 left-0 h-auto" alt="roses img" loading="lazy" />
    </div>
  );
};

export default DetailsFrame;
