import { useState } from "react";
import { useRevealOnView } from "../../lib/useRevealOnView";

/** The two answers, in the order they sit in the control. */
const ANSWERS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

type Answer = (typeof ANSWERS)[number]["value"];

const RsvpSection = () => {
  /** `null` until they pick — that is what keeps the slider hidden at first. */
  const [attending, setAttending] = useState<Answer | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  /** Nothing can be sent until they have answered the one question that matters. */
  const canSend = attending !== null;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    // TODO: send { attending, name, message } wherever the responses should land.
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

        {/* the form */}
        <form onSubmit={submit} className="reveal-in relative mt-5 rounded-xl w-[90%] py-2 bg-secondary border-2 border-secondary-light flex items-center flex-col">
          <p className="text-on-media font-alex pt-2 text-4xl">Are you coming</p>

          {/* the lizard image — Pascal reacts to the answer, so only one shows */}
          <img src="/angry-lizard.png" alt="" aria-hidden className={`absolute top-2 left-0 w-22 -translate-y-full ${attending === "no" ? "" : "hidden"}`} />
          <img src="/happy-lizard.png" alt="" aria-hidden className={`absolute top-6 left-0 w-20 -translate-y-full ${attending === "no" ? "hidden" : ""}`} />

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
              className="w-full rounded-full bg-scrim/15 px-5 py-2 font-sans text-on-media placeholder:text-on-media/60 focus:bg-scrim/25 focus:outline-none focus:ring-2 focus:ring-surface-raised/70"
            />
          </label>

          {/* a note for the couple */}
          <label className="mt-3 w-[80%]">
            <span className="sr-only">Write us a message</span>
            <textarea
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write us a message…"
              rows={3}
              className="w-full resize-none rounded-2xl bg-scrim/15 px-5 py-3 font-sans text-on-media placeholder:text-on-media/60 focus:bg-scrim/25 focus:outline-none focus:ring-2 focus:ring-surface-raised/70"
            />
          </label>

          {/* `disabled` is the affordance; the real gate is the `!canSend`
              early return in `submit`. */}
          <button
            type="submit"
            disabled={!canSend}
            className="mt-4 w-[80%] rounded-full bg-surface-raised py-2 font-sans font-bold text-secondary transition-transform duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          >
            Send
          </button>

          {/* only speaks while the one required answer is still missing */}
          <p aria-live="polite" className={`mt-4 h-5 font-sans text-xs text-on-media/80 ${canSend ? "invisible" : ""}`}>
            Pick Yes or No first
          </p>

          {/* the closing line — the last thing they read before they send */}
          <p className="mt-2 mb-2 w-[80%] text-center font-alex text-3xl leading-snug text-on-media/90">thank you for being part of ours.</p>
        </form>

        <div id="image-container">
          <img src="/split.png" alt="split image" className="w-90 reveal-in-image" />
        </div>
      </div>
      <img src="/tour.png" alt="split image" className=" absolute top-0 -translate-y-20 z-0 -right-20 w-90" />
    </section>
  );
};

export default RsvpSection;
