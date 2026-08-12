// lib/gsap.ts

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { prefersReducedMotion } from "./motion";

/**
 * One registration point for the whole app. Registering twice is harmless, but
 * registering in each component means a missed call only shows up as a silently
 * dead animation, so components import from here and never call register again.
 *
 * Deliberately not registered: ScrollSmoother (fights iOS Safari address-bar
 * resizing on a full-height hero), Draggable, MorphSVG, the physics plugins —
 * add them here when something actually needs one, so the bundle stays honest.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText, Flip, Observer, CustomEase);

/**
 * Site-wide easing vocabulary. Named so the intent survives a copy-paste;
 * `ease: "reveal"` in a tween resolves to whichever curve is defined here.
 */
CustomEase.create("reveal", "0.16, 1, 0.3, 1"); // slow settle, for text coming in
CustomEase.create("drop", "0.7, 0, 0.84, 0"); // accelerates away, for exits

gsap.defaults({ ease: "reveal", duration: 0.6 });

/**
 * Visitors who asked for less motion get the end state instantly rather than a
 * half-speed version of the same choreography. `globalTimeline.timeScale(200)`
 * would still run ScrollTriggers; setting duration to 0 by default keeps every
 * `from()`/`to()` landing on its final values on the first tick.
 */
if (prefersReducedMotion()) {
  gsap.defaults({ duration: 0 });
  gsap.globalTimeline.timeScale(100);
}

export { gsap, useGSAP, ScrollTrigger, ScrollToPlugin, SplitText, Flip, Observer, CustomEase };
