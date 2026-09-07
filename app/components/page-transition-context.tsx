"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

// v2 — direct follow-up after the first build ("laggy/buggy... not the
// same as the site weve got it from"). Live-tested rudeingenierie.com
// directly this round instead of going on the screenshot alone: its
// own .transition-block grid is 42 plain solid-color <div>s animating
// opacity, not a shader sampled through an SVG mask — and the visible
// menu-open reveal the user screenshotted is a DIFFERENT feature on
// that site from its page-to-page navigation. The v1 build's real bug
// (see PageTransitionOverlay.tsx's old comment, since replaced) was
// masking a live WebGL canvas through 60 individually CSS-transitioning
// SVG rects — expensive per-pixel mask compositing every frame, the
// likely source of the reported lag. v2 drops masking entirely: a
// small number of plain <div> strips slide via transform (GPU
// compositor only, the cheapest possible animation), with the shader
// canvas sitting unmasked underneath them as a brief flash once they
// part — same material, without ever compositing it through a mask.
//
// Direction, direct request ("slides down from the top or bottom
// depending on what section you click"): "forward" (About, a project,
// next-project — going deeper) drops in from the top and exits out
// the bottom; "back" (every back-link) rises in from the bottom and
// exits out the top — a push/pop convention, not literal replication
// of the reference's own per-section logic (its exact rule wasn't
// observable live — clicks on its project links never actually
// navigated in headless testing), but it satisfies the same
// "depends on which way you're going" description.
export type TransitionPhase = "idle" | "covering" | "revealing";
export type TransitionDirection = "forward" | "back";

// Cover: strips slide in, staggered left-to-right on top of each
// strip's own transform duration.
export const COVER_TRANSITION_MS = 420;
export const COVER_STAGGER_MS = 140;
// Hold: fully covered, real navigation happens invisibly underneath.
export const HOLD_MS = 260;
// Reveal: strips continue in the same direction of travel they
// entered from (down-and-out or up-and-out, never reversing), same
// stagger shape as the cover.
export const REVEAL_TRANSITION_MS = 420;
export const REVEAL_STAGGER_MS = 140;

const TOTAL_COVER_MS = COVER_TRANSITION_MS + COVER_STAGGER_MS;
const TOTAL_REVEAL_MS = REVEAL_TRANSITION_MS + REVEAL_STAGGER_MS;

const PageTransitionContext = createContext<{
  phase: TransitionPhase;
  direction: TransitionDirection;
  trigger: (direction?: TransitionDirection) => void;
} | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [direction, setDirection] = useState<TransitionDirection>("forward");
  const timeoutsRef = useRef<number[]>([]);
  const rafsRef = useRef<number[]>([]);

  const trigger = useCallback((dir: TransitionDirection = "forward") => {
    // Same reduced-motion contract every other motion feature in this
    // codebase honors — real navigation still happens (this never
    // intercepts/prevents the click), it just skips the whole
    // cover/hold/reveal show around it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    rafsRef.current.forEach(cancelAnimationFrame);
    rafsRef.current = [];

    // "idle" first, always — a real bug caught live: the previous
    // build let a consecutive/opposite-direction trigger jump straight
    // into "covering" from wherever the strips happened to be resting
    // (the exit point of whatever the last transition was), which for
    // a same-direction repeat (e.g. clicking "next project" twice)
    // meant entering from the wrong edge, and for idle's own resting
    // formula recomputing off the *new* direction meant the strips
    // could visibly sweep back across the screen the instant a
    // transition finished, before ever being clicked again. Setting
    // "idle" (with the new direction already committed) first makes
    // PageTransitionOverlay snap the strips to *this* direction's real
    // entry point with the transition disabled — see its own comment —
    // then the double rAF below waits for that snap to actually paint
    // before starting the real, transitioned "covering" animation, the
    // standard technique for restarting a CSS transition cleanly.
    setDirection(dir);
    setPhase("idle");
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        setPhase("covering");
        timeoutsRef.current = [
          window.setTimeout(() => setPhase("revealing"), TOTAL_COVER_MS + HOLD_MS),
          window.setTimeout(() => setPhase("idle"), TOTAL_COVER_MS + HOLD_MS + TOTAL_REVEAL_MS),
        ];
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
