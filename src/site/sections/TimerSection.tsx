// site/sections/TimerSection.tsx

import { useEffect, useState } from "react";
import DiamondRule from "../../components/icons/DiamondRule";
import LeafDivider from "../../components/icons/LeafDivider";
import { INVITATION_DATE } from "../../constants";
import type { CountdownPhase, RemainingTime } from "../../types";

/** Midnight that opens the wedding day: the countdown target. */
const DAY_START = new Date(INVITATION_DATE.year, INVITATION_DATE.month - 1, INVITATION_DATE.day, 0, 0, 0).getTime();

/** Midnight that closes it. */
const DAY_END = new Date(INVITATION_DATE.year, INVITATION_DATE.month - 1, INVITATION_DATE.day + 1, 0, 0, 0).getTime();

const ZERO = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const getRemainingTime = (): RemainingTime => {
  const now = Date.now();

  if (now >= DAY_END) return { ...ZERO, phase: "after" };
  if (now >= DAY_START) return { ...ZERO, phase: "today" };

  const diff = DAY_START - now;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
    phase: "before",
  };
};

const HEADINGS: Record<CountdownPhase, string> = {
  before: "Until our day",
  today: "The day is here",
  after: "Happily engaged",
};

const TimerSection = () => {
  const [remaining, setRemaining] = useState<RemainingTime>(getRemainingTime);

  useEffect(() => {
    if (remaining.phase === "after") return;

    const id = setInterval(() => setRemaining(getRemainingTime()), 1000);

    return () => clearInterval(id);
  }, [remaining.phase]);

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <section className="bg-cream text-ink px-6 py-12">
      <h2 className="font-alex text-center text-3xl font-semibold tracking-wider ">{HEADINGS[remaining.phase]}</h2>

      <DiamondRule className="mx-auto mt-3 h-2 w-36" />

      {/* Equal columns keep every digit in place as the numbers tick, so nothing
          shifts sideways when the seconds roll over or a unit loses a digit. */}
      <div className="divide-gold/40 mx-auto mt-8 grid max-w-md grid-cols-4 divide-x">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col  items-center">
            <span className="font-manrope text-[34px] leading-none font-semibold tabular-nums">{String(unit.value).padStart(2, "0")}</span>

            <span className="font-cormorant mt-2 text-[10px] font-semibold tracking-[0.2em] uppercase">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <LeafDivider />
      </div>
    </section>
  );
};

export default TimerSection;
