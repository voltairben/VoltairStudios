"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

// v5 — direct follow-up ("it just looks like a orange slab moves over
// the page i really want it to have the pixel effect"). Real
// architectural miss: v2-v4 built the cover as a handful of full-
// viewport-HEIGHT bars sliding in via `transform: translateY` — even
// staggered and slowed down, sliding geometry reads as one solid mass
// in motion, not a mosaic of blocks. Live-tested rudeingenierie.com's
// actual reveal directly (see PageTransitionOverlay.tsx's own
// comment): a 2D grid of blocks toggling plain `opacity` in PLACE,
// nothing ever travels across the screen. Switching to that here
// drops the whole positional entry/exit concept — "direction" now
// only changes which row's stagger delay is smallest (top rows first
// vs bottom rows first), a pure timing value, never a geometry one.
// That also RETIRES the double-rAF "snap before animating" dance v2's
// own bug fix needed: idle's resting opacity (0) and revealing's own
// target (0) are the same value, so there's no discontinuity a stray
// transition could ever sweep visibly across — see the removed
// PageTransitionOverlay.tsx comment (git history) for the sliding-era
// version of that bug.
export type TransitionPhase = "idle" | "covering" | "revealing";
export type TransitionDirection = "forward" | "back";

// Cover: blocks fade in, staggered by row on top of each block's own
// opacity-transition duration. v6 pushed duration down to 180ms for a
// "pixel" read (v5 had it backwards — a 650ms fade next to only a
// 500ms spread read as one mushy blob) — direct follow-up since:
// "some opacity change in the pixels when its transitioning so it
// doesnt look like a hard cover." 180ms reads as close to a binary
// on/off snap rather than a visible fade through partial opacity.
// Doubled to 380ms — still well short of the 1000ms stagger (so
// blocks stay distinct events, not overlapping into one mass, the
// actual lesson from v5), but long enough to genuinely see each
// block fading rather than flashing.
export const COVER_TRANSITION_MS = 380;
export const COVER_STAGGER_MS = 1000;
// Hold: fully covered, immediately after which `navigate()` fires and
// the new route renders — this only has to absorb React committing
// the new page's first paint, not a real network round-trip anymore
// (navigate() is called once already fully covered, not on click).
export const HOLD_MS = 200;
// Reveal: blocks fade out in the same row order they faded in with
// (top-to-bottom or bottom-to-top, whichever "forward"/"back" picked),
// same stagger shape as the cover.
export const REVEAL_TRANSITION_MS = 380;
export const REVEAL_STAGGER_MS = 1000;

const TOTAL_COVER_MS = COVER_TRANSITION_MS + COVER_STAGGER_MS;
const TOTAL_REVEAL_MS = REVEAL_TRANSITION_MS + REVEAL_STAGGER_MS;

const PageTransitionContext = createContext<{
  phase: TransitionPhase;
  direction: TransitionDirection;
  trigger: (direction: TransitionDirection, navigate: () => void) => void;
} | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [direction, setDirection] = useState<TransitionDirection>("forward");
  const timeoutsRef = useRef<number[]>([]);

  const trigger = useCallback((dir: TransitionDirection, navigate: () => void) => {
    // Same reduced-motion contract every other motion feature in this
    // codebase honors — navigation still has to actually happen even
    // with the show skipped, since trigger() is now the only thing
    // that calls it (a plain Link's own default behavior no longer
    // fires — see TransitionLink.tsx).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate();
      return;
    }

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setDirection(dir);
    setPhase("covering");
    const coverDone = window.setTimeout(() => {
      // Only now — screen fully opaque — does the real route change
      // happen. Whatever it paints, it paints behind a fully-opaque grid.
      navigate();
      timeoutsRef.current = [
        window.setTimeout(() => setPhase("revealing"), HOLD_MS),
        window.setTimeout(() => setPhase("idle"), HOLD_MS + TOTAL_REVEAL_MS),
      ];
    }, TOTAL_COVER_MS);
    timeoutsRef.current = [coverDone];
  }, []);

  return (
    <PageTransitionContext.Provider value={{ phase, direction, trigger }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}
