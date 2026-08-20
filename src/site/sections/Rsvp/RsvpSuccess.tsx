import { useRef } from "react";
import { Heart, Pencil } from "lucide-react";

import { INVITATION_DATE } from "../../../constants";
import { gsap, useGSAP } from "../../../lib/gsap";
import type { RsvpSuccessProps } from "../../../types";

const RsvpSuccess = ({ guestName, isAttending, guestCount, onEdit, isUpdated }: RsvpSuccessProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Not useRevealOnView: the card replaces the form in place, so it is already
    // on screen and has nothing to wait for.
    gsap.from(cardRef.current, { opacity: 0, y: 16, scale: 0.96, duration: 0.7 });
  });

  /** Reads their own answer back to them, in their own numbers. */
  const answerLine = isAttending
    ? guestCount > 1
      ? `See you and your ${guestCount - 1} ${guestCount === 2 ? "guest" : "guests"} on ${INVITATION_DATE.day}.0${INVITATION_DATE.month}`
      : `See you on ${INVITATION_DATE.day}.0${INVITATION_DATE.month}`
    : "We will miss you — you are with us anyway";

  return (
    /* same shell as the form, so nothing jumps when the two swap */
    <div ref={cardRef} className="relative mt-5 flex w-[90%] flex-col items-center rounded-xl border-2 border-secondary-light bg-secondary py-6">
      {/* Pascal stays for the happy ending, whichever answer it was */}
      <img src="/happy-lizard.png" alt="" aria-hidden className="absolute top-12 left-0 w-30 -translate-y-full" />

      <span className="grid size-12 place-items-center rounded-full bg-surface-raised">
        <Heart className="size-6 fill-secondary text-secondary" />
      </span>

      <p className="mt-3 px-6 text-center font-alex text-4xl leading-tight text-on-media">Thank you, {guestName}</p>

      <p className="mt-1 px-6 text-center font-sans text-sm text-on-media/85">{answerLine}</p>

      <p className="mt-4 w-[80%] text-center font-alex text-3xl leading-snug text-on-media/90">{isUpdated ? "your new answer is safely with us." : "your answer is safely with us."}</p>

      {/* plans change — the way back to the form, kept quiet so it does not
          compete with the thank-you */}
      <button
        type="button"
        onClick={onEdit}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-secondary-light/70 px-4 py-1 font-sans text-xs text-on-media/85 transition-transform duration-200 active:scale-95"
      >
        <Pencil className="size-3.5" />
        Change my answer
      </button>
    </div>
  );
};

export default RsvpSuccess;
