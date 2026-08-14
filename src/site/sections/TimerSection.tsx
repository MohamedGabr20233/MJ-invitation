// site/sections/TimerSection.tsx

import { useEffect, useState } from "react";
import { INVITATION_DATE } from "../../constants";

/** Midnight that opens the wedding day: the countdown target. */
const DAY_START = new Date(INVITATION_DATE.year, INVITATION_DATE.month - 1, INVITATION_DATE.day, 0, 0, 0).getTime();

/** Midnight that closes it. */
const DAY_END = new Date(INVITATION_DATE.year, INVITATION_DATE.month - 1, INVITATION_DATE.day + 1, 0, 0, 0).getTime();

type Phase = "before" | "today" | "after";

type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  phase: Phase;
};

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

const HEADINGS: Record<Phase, string> = {
  before: "Until our day",
  today: "The day is here",
  after: "Happily engaged",
};

/** Rule, centre diamond, rule. Sits under the heading. */
const DiamondRule = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 160 8" aria-hidden className={`text-gold ${className}`}>
    <line x1="0" y1="4" x2="70" y2="4" stroke="currentColor" strokeWidth="1" />
    <line x1="90" y1="4" x2="160" y2="4" stroke="currentColor" strokeWidth="1" />
    <rect x="76" y="0" width="8" height="8" transform="rotate(45 80 4)" fill="currentColor" />
  </svg>
);

/** Two wheat sprigs leaning toward a centre diamond. Closes the section. */
const LeafDivider = () => (
  <svg viewBox="0 0 220 24" fill="none" aria-hidden className="text-gold h-5 w-52">
    <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      {/* left sprig, tip pointing outward, growing toward the centre */}
      <path d="M14 16q38-9 82-4" />
      <path d="M30 13q4-6 11-5M46 11q4-6 11-5M62 10q4-6 11-5M78 9q4-6 11-5" />
      <path d="M38 14q5 5 12 4M54 12q5 5 12 4M70 11q5 5 12 4" />
      {/* right sprig, mirrored */}
      <path d="M206 16q-38-9-82-4" />
      <path d="M190 13q-4-6-11-5M174 11q-4-6-11-5M158 10q-4-6-11-5M142 9q-4-6-11-5" />
      <path d="M182 14q-5 5-12 4M166 12q-5 5-12 4M150 11q-5 5-12 4" />
    </g>
    <rect x="106" y="8" width="8" height="8" transform="rotate(45 110 12)" fill="currentColor" />
  </svg>
);

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
      <h2 className="font-cormorant text-center text-[15px] font-semibold tracking-[0.35em] uppercase">{HEADINGS[remaining.phase]}</h2>

      <DiamondRule className="mx-auto mt-3 h-2 w-36" />

      {/* Equal columns keep every digit in place as the numbers tick, so nothing
          shifts sideways when the seconds roll over or a unit loses a digit. */}
      <div className="divide-gold/40 mx-auto mt-8 grid max-w-md grid-cols-4 divide-x">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center">
            <span className="font-cormorant text-[34px] leading-none font-semibold tabular-nums">{String(unit.value).padStart(2, "0")}</span>

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
