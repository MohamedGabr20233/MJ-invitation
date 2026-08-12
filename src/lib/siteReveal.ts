// lib/siteReveal.ts

import { createContext, useContext } from "react";

/**
 * True once the site is actually on screen behind the gate — the moment the
 * cover drops mid-flash, not when the whole reveal has finished settling.
 *
 * Defaults to true so anything rendered without the gate (a returning visitor,
 * a test) plays straight away.
 */
export const SiteVisibleContext = createContext(true);

/** For media that should not start until the visitor can see it. */
export const useIsSiteVisible = () => useContext(SiteVisibleContext);
