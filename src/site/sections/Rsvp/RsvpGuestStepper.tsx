import { Minus, Plus } from "lucide-react";

import { RSVP_LIMITS } from "../../../constants";
import type { RsvpGuestStepperProps } from "../../../types";

const RsvpGuestStepper = ({ guestCount, onChange }: RsvpGuestStepperProps) => {
  const canRemoveGuest = guestCount > RSVP_LIMITS.MIN_GUESTS;
  const canAddGuest = guestCount < RSVP_LIMITS.MAX_GUESTS;

  return (
    /* same pill shell as the name input, so the field reads as one family */
    <div className="flex w-full items-center justify-between rounded-full bg-scrim/15 py-1 pr-1 pl-5">
      <span className="font-sans text-sm text-on-media/80">How many of you?</span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(guestCount - 1)}
          disabled={!canRemoveGuest}
          aria-label="One guest fewer"
          className="grid size-8 place-items-center rounded-full bg-scrim/20 text-on-media transition-transform duration-200 active:scale-90 disabled:opacity-40 disabled:active:scale-100"
        >
          <Minus className="size-4" />
        </button>

        {/* aria-live so a screen reader hears the new number, not just the tap */}
        <span aria-live="polite" className="w-8 text-center font-sans font-bold text-on-media">
          {guestCount}
        </span>

        <button
          type="button"
          onClick={() => onChange(guestCount + 1)}
          disabled={!canAddGuest}
          aria-label="One guest more"
          className="grid size-8 place-items-center rounded-full bg-surface-raised text-secondary transition-transform duration-200 active:scale-90 disabled:opacity-40 disabled:active:scale-100"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default RsvpGuestStepper;
