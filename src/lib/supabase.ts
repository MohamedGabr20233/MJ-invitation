// lib/supabase.ts

import { createClient } from "@supabase/supabase-js";

/* One client for the whole app. This is a static SPA — there is no server to
   hide a key behind, so the browser talks to Supabase directly with the anon
   key and row-level security is the real gate: `rsvp_responses` has an insert
   policy and no select policy, so a visitor can add their answer and can never
   read anybody else's. */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** False when either env var is missing, i.e. a deploy that forgot its keys. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * `null` rather than a client built on empty strings — a misconfigured build
 * then takes the same "Supabase is unreachable" path as a real outage instead
 * of throwing on the first call.
 */
export const supabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      // Nobody signs in, so there is no session worth persisting or refreshing.
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

/** Bucket holding the photos guests attach to their RSVP. */
export const RSVP_PHOTO_BUCKET = "rsvp-photos";

/**
 * Browser-readable url for a stored photo. The bucket is public and read is the
 * one thing anon may do there, so a plain public url is enough — no signing,
 * and it works while the form is showing a photo sent on an earlier visit.
 */
export const rsvpPhotoUrl = (photoPath: string | null) => {
  if (!photoPath || !supabaseClient) return null;

  return supabaseClient.storage.from(RSVP_PHOTO_BUCKET).getPublicUrl(photoPath).data.publicUrl;
};
