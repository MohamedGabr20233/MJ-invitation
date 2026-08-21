import { useEffect, useState } from "react";
import { Loader2, LogOut, RefreshCw } from "lucide-react";

import { COUPLES_NAMES, RSVP_MAINTENANCE_AR } from "../constants";
import { useComingAuthStore } from "../store/comingAuthStore";
import { useRsvpFeedStore } from "../store/rsvpFeedStore";
import type { ComingFilter, RsvpAnalytics, RsvpResponseRow } from "../types";
import ComingLogin from "./ComingLogin";
import GuestCard from "./GuestCard";
import StatCard from "./StatCard";

const FILTERS = [
  { value: "all", label: "Everyone" },
  { value: "yes", label: "Coming" },
  { value: "no", label: "Not coming" },
] as const;

/** One pass over the rows for every number the head of the page shows. */
const analyseResponses = (responses: RsvpResponseRow[]): RsvpAnalytics =>
  responses.reduce<RsvpAnalytics>(
    (running, response) => ({
      acceptedCount: running.acceptedCount + (response.is_attending ? 1 : 0),
      declinedCount: running.declinedCount + (response.is_attending ? 0 : 1),
      responseCount: running.responseCount + 1,
      // A "no" brings nobody, whatever number happens to sit on the row.
      totalPeople: running.totalPeople + (response.is_attending ? response.guest_count : 0),
      messageCount: running.messageCount + (response.message ? 1 : 0),
      photoCount: running.photoCount + (response.photo_path ? 1 : 0),
    }),
    { acceptedCount: 0, declinedCount: 0, responseCount: 0, totalPeople: 0, messageCount: 0, photoCount: 0 },
  );

/**
 * `/coming` — the guest list behind the RSVP form: the counts, then a card per
 * answer that opens to the message and photo.
 *
 * Sits behind the sign-in in lib/comingAuth, which is a courtesy lock, not a
 * wall: the check runs in the visitor's own browser and the anon key that reads
 * these rows ships in the bundle either way. Anything stronger has to move to
 * Supabase Auth with an RLS select policy for the authenticated role.
 */
const ComingPage = () => {
  const isAuthenticated = useComingAuthStore((state) => state.isAuthenticated);
  const signOut = useComingAuthStore((state) => state.signOut);

  const responses = useRsvpFeedStore((state) => state.responses);
  const isLoading = useRsvpFeedStore((state) => state.isLoading);
  const isUnavailable = useRsvpFeedStore((state) => state.isUnavailable);
  const loadResponses = useRsvpFeedStore((state) => state.load);

  const [filter, setFilter] = useState<ComingFilter>("all");
  /** Only one card stays open, so the list never turns into a wall. */
  const [openResponseId, setOpenResponseId] = useState<string | null>(null);

  useEffect(() => {
    // Nothing is fetched until they are in, so a stranger never pulls the rows.
    if (isAuthenticated) void loadResponses();
    // Once, on sign-in — the refresh button covers everything after that.
  }, [isAuthenticated, loadResponses]);

  if (!isAuthenticated) return <ComingLogin />;

  const analytics = analyseResponses(responses);

  const shownResponses = responses.filter((response) => filter === "all" || (filter === "yes") === response.is_attending);

  return (
    <div className="mx-auto min-h-dvh w-full bg-surface px-4 pb-10 md:max-w-150">
      <header className="relative pt-8 pb-6 text-center">
        <p className="font-sans text-[0.625rem] uppercase tracking-[0.3em] text-secondary-dark">who is coming</p>
        <h1 className="mt-1 font-alex text-5xl text-primary">
          {COUPLES_NAMES.MALE} &amp; {COUPLES_NAMES.FEMALE}
        </h1>

        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="absolute right-0 top-8 grid size-9 place-items-center rounded-full border-2 border-secondary-light bg-surface-raised text-secondary-dark transition-transform duration-200 active:scale-90"
        >
          <LogOut className="size-4" />
        </button>
      </header>

      {/* the two that matter, big */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard tone="accepted" label="said yes" value={analytics.acceptedCount} caption="coming" />
        <StatCard tone="declined" label="said no" value={analytics.declinedCount} caption="can't make it" />
      </div>

      {/* the totals, quiet underneath */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <StatCard tone="neutral" label="responses" value={analytics.responseCount} />
        <StatCard tone="neutral" label="people in total" value={analytics.totalPeople} />
      </div>

      <p className="mt-3 text-center font-sans text-xs text-muted/70">
        {analytics.messageCount} {analytics.messageCount === 1 ? "message" : "messages"} · {analytics.photoCount} {analytics.photoCount === 1 ? "photo" : "photos"}
      </p>

      <div className="mt-6 flex items-center gap-2">
        {/* filters carry the count they would show, so the tap is informed */}
        <div className="flex flex-1 gap-1 rounded-full bg-secondary-light/50 p-1">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`flex-1 rounded-full py-1.5 font-sans text-xs font-bold transition-colors duration-200 ${filter === option.value ? "bg-surface-raised text-primary shadow" : "text-secondary-dark"}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => void loadResponses()}
          disabled={isLoading}
          aria-label="Reload the answers"
          className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-secondary-light bg-surface-raised text-secondary-dark transition-transform duration-200 active:scale-90 disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading && responses.length === 0 && (
        <p className="mt-10 flex items-center justify-center gap-2 font-sans text-sm text-muted/70">
          <Loader2 className="size-4 animate-spin" />
          Counting…
        </p>
      )}

      {/* same failure copy as the RSVP form, so one outage speaks once */}
      {isUnavailable && (
        <div dir="rtl" className="mt-8 flex flex-col items-center gap-3 rounded-2xl border-2 border-secondary-light bg-surface-raised px-4 py-5">
          <p role="alert" className="text-center font-thuluth text-xl leading-relaxed text-primary">
            {RSVP_MAINTENANCE_AR.message}
          </p>

          <button type="button" onClick={() => void loadResponses()} className="rounded-full bg-primary px-5 py-1 font-thuluth text-lg text-on-media transition-transform duration-200 active:scale-95">
            {RSVP_MAINTENANCE_AR.retryLabel}
          </button>
        </div>
      )}

      {!isLoading && !isUnavailable && shownResponses.length === 0 && <p className="mt-10 text-center font-alex text-3xl text-muted/70">nothing here yet.</p>}

      <ul className="mt-4 flex flex-col gap-2">
        {shownResponses.map((response) => (
          <GuestCard key={response.id} response={response} isOpen={openResponseId === response.id} onToggle={() => setOpenResponseId(openResponseId === response.id ? null : response.id)} />
        ))}
      </ul>
    </div>
  );
};

export default ComingPage;
