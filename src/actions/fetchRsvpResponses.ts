// actions/fetchRsvpResponses.ts

import { supabaseClient } from "../lib/supabase";
import type { RsvpFeedResult } from "../types";

/**
 * Every answer, newest first, for the /coming dashboard.
 *
 * Reading only works because `rsvp_responses` carries a select policy for anon
 * (see supabase/schema.sql) — which is also why /coming is public to anyone who
 * loads the bundle, not just to whoever knows the url.
 *
 * Never throws: the page shows the same Arabic maintenance line the RSVP form
 * uses when the store cannot be reached.
 */
export const fetchRsvpResponses = async (): Promise<RsvpFeedResult> => {
  if (!supabaseClient) return { status: "unavailable" };

  try {
    const { data, error } = await supabaseClient.from("rsvp_responses").select("*").order("created_at", { ascending: false });

    if (error || !data) return { status: "unavailable" };

    return { status: "ok", responses: data };
  } catch {
    return { status: "unavailable" };
  }
};
