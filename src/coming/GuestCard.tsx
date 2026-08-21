import { ChevronDown, ImageOff, MessageSquare, Users } from "lucide-react";

import { rsvpPhotoUrl } from "../lib/supabase";
import type { GuestCardProps } from "../types";

/** `2026-08-20T18:04:00Z` → `20 Aug, 18:04`, in the reader's own timezone. */
const formatAnsweredAt = (isoDate: string) =>
  new Date(isoDate).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const GuestCard = ({ response, isOpen, onToggle }: GuestCardProps) => {
  const photoUrl = rsvpPhotoUrl(response.photo_path);
  const hasDetails = Boolean(response.message || photoUrl);

  return (
    <li className="overflow-hidden rounded-2xl border-2 border-secondary-light bg-surface-raised shadow-card">
      {/* the whole head is the toggle — a card this small has no room for a
          separate affordance */}
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        {/* the answer, as a colour before it is a word */}
        <span className={`size-2.5 shrink-0 rounded-full ${response.is_attending ? "bg-primary" : "bg-secondary-dark"}`} aria-hidden />

        <span className="min-w-0 flex-1">
          <span className="block truncate font-cormorant text-xl font-bold text-primary">{response.guest_name}</span>
          <span className="block font-sans text-[0.625rem] uppercase tracking-widest text-muted/70">
            {response.is_attending ? "coming" : "not coming"} · {formatAnsweredAt(response.created_at)}
            {response.updated_at && " · changed"}
          </span>
        </span>

        {/* headcount only means something on a yes */}
        {response.is_attending && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/20 px-2.5 py-1 font-sans text-xs font-bold text-primary">
            <Users className="size-3.5" />
            {response.guest_count}
          </span>
        )}

        {response.message && <MessageSquare className="size-4 shrink-0 text-secondary-dark" aria-label="left a message" />}

        <ChevronDown className={`size-4 shrink-0 text-secondary-dark transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {isOpen && (
        <div className="border-t-2 border-secondary-light/60 px-4 py-3">
          {response.message && <p className="font-merriweather text-sm leading-relaxed whitespace-pre-line text-muted">{response.message}</p>}

          {photoUrl && (
            <a href={photoUrl} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-xl border-2 border-secondary-light">
              {/* lazy: a long list would otherwise pull every photo at once */}
              <img src={photoUrl} alt={`Photo sent by ${response.guest_name}`} loading="lazy" className="max-h-80 w-full object-cover" />
            </a>
          )}

          {!hasDetails && (
            <p className="flex items-center gap-2 font-sans text-xs text-muted/70">
              <ImageOff className="size-4" />
              No message, no photo — just the answer.
            </p>
          )}
        </div>
      )}
    </li>
  );
};

export default GuestCard;
