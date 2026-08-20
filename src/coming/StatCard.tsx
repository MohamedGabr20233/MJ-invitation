import type { StatCardProps } from "../types";

/** Gold on navy for the two headline cards, paper for the quiet strip. */
const TONE_STYLES = {
  accepted: "bg-primary text-on-media border-secondary",
  declined: "bg-secondary text-on-media border-secondary-light",
  neutral: "bg-surface-raised text-primary border-secondary-light",
} as const;

const StatCard = ({ label, value, caption, tone }: StatCardProps) => {
  const isHeadline = tone !== "neutral";

  return (
    <div className={`flex flex-col items-center rounded-2xl border-2 shadow-card ${TONE_STYLES[tone]} ${isHeadline ? "py-5" : "py-3"}`}>
      <span className={`font-cormorant font-bold tabular-nums ${isHeadline ? "text-5xl" : "text-3xl"}`}>{value}</span>

      <span className={`mt-1 font-sans uppercase tracking-widest ${isHeadline ? "text-xs" : "text-[0.625rem]"} opacity-85`}>{label}</span>

      {/* only the headline cards carry a caption — the strip has no room */}
      {caption && <span className="mt-0.5 font-alex text-xl opacity-90">{caption}</span>}
    </div>
  );
};

export default StatCard;
