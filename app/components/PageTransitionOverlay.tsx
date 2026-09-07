"use client";

import {
  usePageTransition,
  COVER_TRANSITION_MS,
  COVER_STAGGER_MS,
  REVEAL_TRANSITION_MS,
  REVEAL_STAGGER_MS,
} from "./page-transition-context";

// Column count for the strip sweep — a handful of wide bars. Cheap on
// purpose: each strip is one plain <div>, animated only via
// `transform`, the one CSS property that never triggers layout or
// paint — the whole cover/reveal is GPU compositor work, nothing else.
const COLS = 8;

// v3 — direct follow-up ("1 colour would work better than the same as
// the loading page... change it to the persimmon weve been using").
// Drops the shader (LoadingShader) entirely — solid var(--color-amber-
// bright) fill instead, set in globals.css's .page-transition-strip.
// No canvas, no WebGL context to mount/unmount; this component is now
// just the strip grid itself. See page-transition-context.tsx for the
// v3 sequencing fix (navigate() only fires once fully covered).
export default function PageTransitionOverlay() {
  const { phase, direction } = usePageTransition();

  const isIdle = phase === "idle";
  const covering = phase === "covering";
  const staggerMs = phase === "revealing" ? REVEAL_STAGGER_MS : COVER_STAGGER_MS;
  const transitionMs = phase === "revealing" ? REVEAL_TRANSITION_MS : COVER_TRANSITION_MS;

  // Forward: strips enter from the top, exit out the bottom — one
  // continuous downward sweep. Back: enter from the bottom, exit out
  // the top. Never reverses direction mid-sweep in either case.
  const offscreenStart = direction === "forward" ? "-100%" : "100%";
  const offscreenEnd = direction === "forward" ? "100%" : "-100%";
  let translateY: string;
  if (isIdle) translateY = offscreenStart;
  else if (covering) translateY = "0%";
  else translateY = offscreenEnd;

  return (
    <div className="page-transition-overlay" aria-hidden="true">
      <div className="page-transition-strips">
        {Array.from({ length: COLS }, (_, i) => (
          <div
            key={i}
            className="page-transition-strip"
            style={{
              transform: `translateY(${translateY})`,
              // Idle always renders instantly (0ms, no delay) — see
              // page-transition-context.tsx's own comment: idle is
              // also used as a one-frame "snap to this direction's
              // entry point" reset before every real cover animation,
              // and that snap must not itself animate (it would be a
              // real, visible sweep across the screen using whatever
              // duration a stale phase left behind — a real bug v2 shipped).
              transitionDuration: isIdle ? "0ms" : `${transitionMs}ms`,
              transitionDelay: isIdle ? "0ms" : `${(i / (COLS - 1)) * staggerMs}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
