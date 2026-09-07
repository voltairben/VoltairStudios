"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

// Direct request, after browsing awwwards.com/elements/transition
// together and picking rude-ingenierie.com's own block-wipe as the
// reference: a scattered grid of blocks sweeps in (hiding the old
// page), holds while the real navigation happens underneath unseen,
// then sweeps back out in a staggered mosaic (revealing the new page)
// — using the loading screen's own animated shader as the block
// material, not a flat color, per direct request ("use the
// loadingscreen... except the loading % and logo").
//
// A deliberately custom, non-View-Transitions-API mechanism — the
// browser's ::view-transition-old/new(name) pseudo-elements are
// UA-controlled rasterized snapshots of the real page (see
// PageTransitionOverlay.tsx's own comment for why that rules them out
// as a home for a live WebGL shader or a real animated SVG mask), so
// this is a plain fixed overlay + a JS-driven timing state machine
// instead, decoupled from actual navigation completion: the cover
// phase is opaque long enough that real navigation (Next.js
// prefetched routes resolve fast) safely finishes underneath,
// unseen, before the reveal starts.
export type TransitionPhase = "idle" | "covering" | "revealing";

// Cover: blocks appear, staggered up to COVER_STAGGER_MS on top of
// each block's own COVER_TRANSITION_MS fade — fast, since this is
// just hiding the old page, not the effect's own showcase moment.
export const COVER_TRANSITION_MS = 180;
export const COVER_STAGGER_MS = 90;
// Hold: fully covered, real navigation happens invisibly. Generous on
// purpose — this doesn't watch real page-readiness (heavier routes
// like /about have their own async scene/asset loading with no single
// generalizable "ready" signal to gate on the way LoadingScreen's own
// skybox-specific progress does), so the margin has to absorb a real
// navigation + first paint on its own.
export const HOLD_MS = 420;
// Reveal: the reference's own signature beat — blocks disappear in a
// wider, slower stagger than the cover phase, so the mosaic reads as
// a real reveal, not just the cover playing backward at the same pace.
export const REVEAL_TRANSITION_MS = 260;
export const REVEAL_STAGGER_MS = 320;

const TOTAL_COVER_MS = COVER_TRANSITION_MS + COVER_STAGGER_MS;
const TOTAL_REVEAL_MS = REVEAL_TRANSITION_MS + REVEAL_STAGGER_MS;

const PageTransitionContext = createContext<{
  phase: TransitionPhase;
  trigger: () => void;
} | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const timeoutsRef = useRef<number[]>([]);

  const trigger = useCallback(() => {
    // Same reduced-motion contract every other motion feature in this
    // codebase honors — real navigation still happens (this never
    // intercepts/prevents the click), it just skips the whole
    // cover/hold/reveal show around it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPhase("covering");
    timeoutsRef.current = [
      window.setTimeout(() => setPhase("revealing"), TOTAL_COVER_MS + HOLD_MS),
      window.setTimeout(() => setPhase("idle"), TOTAL_COVER_MS + HOLD_MS + TOTAL_REVEAL_MS),
    ];
  }, []);

  return (
    <PageTransitionContext.Provider value={{ phase, trigger }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}
