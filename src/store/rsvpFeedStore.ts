// store/rsvpFeedStore.ts

import { create } from "zustand";

import { fetchRsvpResponses } from "../actions/fetchRsvpResponses";
import type { RsvpFeedStore } from "../types";

/**
 * The answers behind /coming. A store rather than component state because the
 * fetch is the page's one side effect, and keeping it out here means a refresh
 * leaves the rows on screen while it runs — the list never blanks.
 */
export const useRsvpFeedStore = create<RsvpFeedStore>((set) => ({
  responses: [],
  isLoading: true,
  isUnavailable: false,

  load: async () => {
    set({ isLoading: true });

    const result = await fetchRsvpResponses();

    if (result.status === "unavailable") {
      set({ isUnavailable: true, isLoading: false });
      return;
    }

    set({ responses: result.responses, isUnavailable: false, isLoading: false });
  },
}));
