"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

// v3 — direct follow-up ("it first lets me see the page and then the
// transition screen comes, it has a delay"). Real bug: v2 let
// next-view-transitions' own <Link> fire real navigation immediately
// on click, on its own independent timeline from this overlay's
// cover animation — a static, prefetched Next.js route can paint in
// well under 100ms, faster than the strips' own ~560ms close, so the
// destination page was visibly rendering underneath through the
// still-open gaps before the cover finished sweeping in. trigger()
// now OWNS navigation instead of racing it: call sites preventDefault
// the real Link click and hand trigger() a `navigate` callback, which
// only fires once every strip has fully closed — the browser physically
// cannot paint the new route before the screen is opaque. See
// TransitionLink.tsx and each call site for the useTransitionRouter()
// wiring this requires.
export type TransitionPhase = "idle" | "covering" | "revealing";
export type TransitionDirection = "forward" | "back";

// Cover: strips slide in, staggered left-to-right on top of each
// strip's own transform duration. Direct follow-up ("slowed... so you
// can actually see the blocks... the blocks dont come as fast as we
// have it now") — v3's 420/140 made every strip arrive within ~560ms
// of each other, close enough to read as one near-simultaneous snap
// rather than a visible, one-after-another sweep. Both numbers pushed
// up, and the stagger widened much more than the duration — a wider
// spread relative to each strip's own travel time is what actually
// makes the wave read as sequential blocks landing, not just "slower."
export const COVER_TRANSITION_MS = 650;
export const COVER_STAGGER_MS = 500;
// Hold: fully covered, immediately after which `navigate()` fires and
// the new route renders — this only has to absorb React committing
// the new page's first paint, not a real network round-trip anymore
// (navigate() is called once already fully covered, not on click).
export const HOLD_MS = 200;
// Reveal: strips continue in the same direction of travel they
// entered from (down-and-out or up-and-out, never reversing), same
// stagger shape as the cover.
export const REVEAL_TRANSITION_MS = 650;
export const REVEAL_STAGGER_MS = 500;

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
  const rafsRef = useRef<number[]>([]);

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
    rafsRef.current.forEach(cancelAnimationFrame);
    rafsRef.current = [];

    // "idle" first, always — a real bug caught live in v2: a
    // consecutive/opposite-direction trigger jumping straight into
    // "covering" from wherever the strips happened to be resting (the
    // exit point of whatever the last transition was) entered from the
    // wrong edge on a same-direction repeat, and idle's own resting
    // formula recomputing off the *new* direction could visibly sweep
    // the strips back across the screen the instant a transition
    // finished. Setting "idle" (with the new direction already
    // committed) first makes PageTransitionOverlay snap the strips to
    // *this* direction's real entry point with the transition disabled
    // — see its own comment — then the double rAF below waits for that
    // snap to actually paint before starting the real, transitioned
    // "covering" animation, the standard technique for restarting a
    // CSS transition cleanly.
    setDirection(dir);
    setPhase("idle");
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setPhase("covering");
        const coverDone = window.setTimeout(() => {
          // Only now — screen fully opaque — does the real route
          // change happen. Whatever it paints, it paints behind
          // fully-closed strips.
          navigate();
          timeoutsRef.current = [
            window.setTimeout(() => setPhase("revealing"), HOLD_MS),
            window.setTimeout(() => setPhase("idle"), HOLD_MS + TOTAL_REVEAL_MS),
          ];
        }, TOTAL_COVER_MS);
        timeoutsRef.current = [coverDone];
      });
      rafsRef.current = [raf2];
    });
    rafsRef.current = [raf1];
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
