import { useState } from "react";

import { submitRsvp } from "../../../actions/submitRsvp";
import { RSVP_LIMITS, RSVP_MAINTENANCE_AR, RSVP_STORAGE_KEY } from "../../../constants";
import { rsvpPhotoUrl } from "../../../lib/supabase";
import { useRevealOnView } from "../../../lib/useRevealOnView";
import type { RsvpAnswer, RsvpFormStatus, SavedRsvp } from "../../../types";
import RsvpGuestStepper from "./RsvpGuestStepper";
import RsvpPhotoPicker from "./RsvpPhotoPicker";
import RsvpSuccess from "./RsvpSuccess";

/** The two answers, in the order they sit in the control. */
const ANSWERS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

/**
 * The RSVP they already sent, if this browser sent one. Read once at mount so a
 * reload brings the thank-you card back instead of an empty form — mirrors the
 * `sessionStorage` guard the entry gate uses.
 */
const readSentRsvp = (): SavedRsvp | null => {
  try {
    const storedRsvp = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!storedRsvp) return null;

    const savedRsvp = JSON.parse(storedRsvp) as SavedRsvp;

    // A record from before answers were editable has no id, so there is no row
    // to update — treat it as never sent rather than writing to nothing.
    return savedRsvp.rsvpId ? savedRsvp : null;
  } catch {
    // Private mode, blocked storage, hand-edited value — just show the form.
    return null;
  }
};

const RsvpSection = () => {
  /** The answer this browser already sent, if any. Read once, at mount. */
  const [sentRsvp, setSentRsvp] = useState<SavedRsvp | null>(readSentRsvp);

  /** `null` until they pick — that is what keeps the slider hidden at first. */
  const [attending, setAttending] = useState<RsvpAnswer | null>(sentRsvp ? (sentRsvp.isAttending ? "yes" : "no") : null);
  const [name, setName] = useState(sentRsvp?.guestName ?? "");
  const [message, setMessage] = useState(sentRsvp?.message ?? "");
  const [guestCount, setGuestCount] = useState<number>(sentRsvp?.guestCount ?? RSVP_LIMITS.MIN_GUESTS);
  // A File cannot survive a reload, so a re-opened form starts with no pick and
  // leans on `photoPath` below to show the photo that is already on the row.
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(sentRsvp?.photoPath ?? null);

  const [status, setStatus] = useState<RsvpFormStatus>(sentRsvp ? "sent" : "idle");
  /** Only changes the closing line on the card. */
  const [hasChangedAnswer, setHasChangedAnswer] = useState(false);
  /** The single message slot under the button — validation and file errors share it. */
  const [hint, setHint] = useState("");

  const trimmedName = name.trim();

  /** Nothing can be sent until they answered and told us who they are. */
  const canSend = attending !== null && trimmedName.length >= RSVP_LIMITS.MIN_NAME_LENGTH;

  /** True while they are rewriting an answer that is already in the table. */
  const isChangingAnswer = sentRsvp !== null && status !== "sent";

  /** What the hint line says while something is still missing. */
  const missingHint = attending === null ? "Pick Yes or No first" : "Add your name";

  const send = async () => {
    if (!canSend) return;

    setStatus("sending");
    setHint("");

    const result = await submitRsvp({
      rsvpId: sentRsvp?.rsvpId ?? null,
      guestName: trimmedName,
      isAttending: attending === "yes",
      guestCount,
      message,
      photoFile,
      photoPath,
    });

    if (result.status === "invalid") {
      setHint(result.hint);
      setStatus("idle");
      return;
    }

    if (result.status === "unavailable") {
      // The draft is left exactly as it was, so the retry button is one tap.
      setStatus("unavailable");
      return;
    }

    const answeredRsvp: SavedRsvp = { rsvpId: result.rsvpId, guestName: trimmedName, isAttending: attending === "yes", guestCount, message, photoPath: result.photoPath };

    try {
      localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(answeredRsvp));
    } catch {
      // Storage being unavailable only costs the card on reload, not the RSVP.
    }

    // The pick has become the stored photo, so the picker reads it from the row
    // from here on and the File can be let go.
    setPhotoPath(result.photoPath);
    setPhotoFile(null);
    setHasChangedAnswer(isChangingAnswer);
    setSentRsvp(answeredRsvp);
    setStatus("sent");
  };

  /** Back to the form, on the same row, with everything they said still there. */
  const editAnswer = () => {
    setHint("");
    setStatus("idle");
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send();
  };

  useRevealOnView(
    "#rsvp",
    ".reveal-in",
    {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.2,
      ease: "power1.inOut",
    },
    { rootMargin: "0px 0px -35% 0px" },
  );

  useRevealOnView(
    "#image-container",
    ".reveal-in-image",
    {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.2,
      ease: "power1.inOut",
    },
    { rootMargin: "0px 0px -35% 0px" },
  );
  return (
    <section id="rsvp" className="w-full  relative flex flex-col items-center pb-5 ">
      {/* the section title  */}
      <div className="relative z-10  w-full flex flex-col items-center rounded-lg pt-4  ">
        <img src="RSVP.png" alt="rsvp section image" className="w-60 reveal-in" />

        {/* the form gives way to the thank-you card once the answer has landed */}
        {status === "sent" && sentRsvp ? (
          <RsvpSuccess {...sentRsvp} onEdit={editAnswer} isUpdated={hasChangedAnswer} />
        ) : (
          <form onSubmit={submit} className="reveal-in relative mt-5 rounded-xl w-[90%] py-2 bg-secondary border-2 border-secondary-light flex items-center flex-col">
            <p className="text-on-media font-alex pt-2 text-4xl">{isChangingAnswer ? "Changed your mind" : "Are you coming"}</p>

            {/* the lizard image — Pascal reacts to the answer, so only one shows */}
            <img src="/angry-lizard.png" alt="" aria-hidden className={`absolute -scale-x-100 top-5 left-2 w-32 -translate-y-full ${attending === "no" ? "" : "hidden"}`} />
            <img src="/happy-lizard.png" alt="" aria-hidden className={`absolute top-12 left-0 w-30 -translate-y-full ${attending === "no" ? "hidden" : ""}`} />

            <fieldset className="mt-4 w-[80%]">
              <legend className="sr-only">Are you coming?</legend>

              <div className="relative grid grid-cols-2 rounded-full bg-secondary-light p-1">
                {/* the sliding pill, hidden until a first pick is made */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface-raised shadow transition-all duration-300 ease-out ${attending === null ? "opacity-0" : "opacity-100"} ${attending === "no" ? "translate-x-full" : "translate-x-0"}`}
                />

                {ANSWERS.map((answer) => (
                  <label
                    key={answer.value}
                    className={`relative z-10 cursor-pointer rounded-full py-2 text-center font-sans font-bold transition-colors duration-300 ${attending === answer.value ? "text-secondary" : "text-on-media"}`}
                  >
                    <input type="radio" name="attending" value={answer.value} checked={attending === answer.value} onChange={() => setAttending(answer.value)} className="sr-only" />
                    {answer.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {/* who is answering */}
            <label className="mt-5 w-[80%]">
              <span className="sr-only">Your name</span>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                maxLength={RSVP_LIMITS.MAX_NAME_LENGTH}
                className="w-full rounded-full bg-scrim/15 px-5 py-2 font-sans text-on-media placeholder:text-on-media/60 focus:bg-scrim/25 focus:outline-none focus:ring-2 focus:ring-surface-raised/70"
              />
            </label>

            {/* how many seats to keep — only a "yes" has anything to count */}
            {attending === "yes" && (
              <div className="mt-3 w-[80%]">
                <RsvpGuestStepper guestCount={guestCount} onChange={setGuestCount} />
              </div>
            )}

            {/* a picture for us to keep, entirely optional */}
            <div className="mt-3 w-[80%]">
              <RsvpPhotoPicker photoFile={photoFile} storedPhotoUrl={rsvpPhotoUrl(photoPath)} onPick={setPhotoFile} onRemoveStored={() => setPhotoPath(null)} onReject={setHint} />
            </div>

            {/* a note for the couple */}
            <label className="mt-3 w-[80%]">
              <span className="sr-only">Write us a message</span>
              <textarea
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write us a message…"
                rows={3}
                maxLength={RSVP_LIMITS.MAX_MESSAGE_LENGTH}
                className="w-full resize-none rounded-2xl bg-scrim/15 px-5 py-3 font-sans text-on-media placeholder:text-on-media/60 focus:bg-scrim/25 focus:outline-none focus:ring-2 focus:ring-surface-raised/70"
              />
            </label>

            {/* `disabled` is the affordance; the real gate is the `!canSend`
                early return in `send`. */}
            <button
              type="submit"
              disabled={!canSend || status === "sending"}
              className={`mt-4 w-[80%] rounded-full bg-surface-raised py-2 font-sans font-bold text-secondary transition-transform duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${status === "sending" ? "animate-pulse" : ""}`}
            >
              {status === "sending" ? (isChangingAnswer ? "Updating…" : "Sending…") : isChangingAnswer ? "Update my answer" : "Send"}
            </button>

            {/* one live line: what is still missing, or why a file was refused */}
            <p aria-live="polite" className={`mt-4 h-5 font-sans text-xs text-on-media/80 ${canSend && !hint ? "invisible" : ""}`}>
              {hint || missingHint}
            </p>

            {/* a way out of the edit that does not touch the row */}
            {isChangingAnswer && (
              <button
                type="button"
                onClick={() => {
                  // Nothing was written, so put the draft back the way the row is.
                  setPhotoPath(sentRsvp?.photoPath ?? null);
                  setPhotoFile(null);
                  setStatus("sent");
                }}
                className="mt-1 font-sans text-xs text-on-media/70 underline transition-transform duration-200 active:scale-95"
              >
                Keep my old answer
              </button>
            )}

            {/* the form is fine, the store is not — Arabic on purpose, and the
                draft is untouched so one tap tries again */}
            {status === "unavailable" && (
              <div dir="rtl" className="mt-1 flex w-[80%] flex-col items-center gap-2 rounded-2xl bg-scrim/20 px-4 py-3">
                <p role="alert" className="text-center  text-xl leading-relaxed text-on-media">
                  {RSVP_MAINTENANCE_AR.message}
                </p>

                <button type="button" onClick={() => void send()} className="rounded-full bg-surface-raised px-5 py-1 font-thuluth text-lg text-secondary transition-transform duration-200 active:scale-95">
                  {RSVP_MAINTENANCE_AR.retryLabel}
                </button>
              </div>
            )}

            {/* the closing line — the last thing they read before they send */}
            <p className="mt-2 mb-2 w-[80%] text-center font-alex text-3xl leading-snug text-on-media/90">thank you for being part of ours.</p>
          </form>
        )}

        <div id="image-container">
          <img src="/split.png" alt="split image" className="w-90 reveal-in-image" />
        </div>
      </div>
      <img src="/tour.png" alt="split image" className=" absolute top-0 -translate-y-20 z-0 -right-20 w-90" />
    </section>
  );
};

export default RsvpSection;
