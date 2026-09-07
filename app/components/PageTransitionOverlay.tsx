"use client";

import { useEffect, useState } from "react";
import LoadingShader from "./LoadingShader";
import {
  usePageTransition,
  COVER_TRANSITION_MS,
  COVER_STAGGER_MS,
  REVEAL_TRANSITION_MS,
  REVEAL_STAGGER_MS,
} from "./page-transition-context";

// Column count for the strip sweep — a handful of wide bars, not the
// v1 mosaic's 60 tiny cells. Cheap on purpose: each strip is one plain
// <div>, animated only via `transform`, the one CSS property that
// never triggers layout or paint — the whole cover/reveal is GPU
// compositor work, nothing else.
const COLS = 8;

// v2 rebuild — see page-transition-context.tsx's own comment for the
// full "why": v1 masked a live WebGL canvas through 60 individually
// CSS-transitioning SVG rects (real per-pixel mask compositing every
// frame) and shipped laggy. This drops masking entirely. The strips
// below are solid, cheap divs; the shader sits UNDERNEATH them,
// unmasked and always fully opaque while mounted, so it only becomes
// visible when a strip's own position genuinely uncovers it — plain
// z-index occlusion, not per-pixel compositing.
export default function PageTransitionOverlay() {
  const { phase, direction } = usePageTransition();
  const [shaderMounted, setShaderMounted] = useState(false);

  // Mount synchronously the moment a transition starts — a React-
  // endorsed "adjust state during render" call (not an effect), so it
  // takes effect the same render instead of one tick late.
  if (phase !== "idle" && !shaderMounted) {
    setShaderMounted(true);
  }

  useEffect(() => {
    if (phase !== "idle") return;
    // Free the WebGL context once fully idle again. Nested in the
    // timeout callback (not the effect body) so this setState is a
    // reaction to a real timer event, not a synchronous effect-body
    // update (react-hooks/set-state-in-effect).
    const timeout = setTimeout(() => setShaderMounted(false), 0);
    return () => clearTimeout(timeout);
  }, [phase]);

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
      {shaderMounted && <LoadingShader />}
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
              // duration a stale phase left behind — the actual bug
              // this replaced).
              transitionDuration: isIdle ? "0ms" : `${transitionMs}ms`,
              transitionDelay: isIdle ? "0ms" : `${(i / (COLS - 1)) * staggerMs}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
