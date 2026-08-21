// store/comingAuthStore.ts

import { create } from "zustand";

import { clearSession, hasValidSession, isComingAuthConfigured, signIn } from "../lib/comingAuth";
import type { ComingAuthStore } from "../types";

/**
 * Who is allowed to see the guest list. A store rather than component state so
 * the page can read the answer before it decides to fetch anything at all — the
 * rows are never pulled for a visitor who has not signed in.
 *
 * The stored session is read once at module load: it either exists or it does
 * not, and nothing outside this tab can change it mid-visit.
 */
export const useComingAuthStore = create<ComingAuthStore>((set) => ({
  isAuthenticated: hasValidSession(),
  status: isComingAuthConfigured ? "idle" : "unconfigured",

  signIn: async (username, password) => {
    set({ status: "checking" });

    const result = await signIn(username, password);

    if (result === "ok") {
      set({ isAuthenticated: true, status: "idle" });
      return;
    }

    set({ isAuthenticated: false, status: result === "unconfigured" ? "unconfigured" : "rejected" });
  },

  signOut: () => {
    clearSession();
    set({ isAuthenticated: false, status: "idle" });
  },
}));
