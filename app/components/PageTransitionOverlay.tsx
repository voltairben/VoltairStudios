"use client";

import { useEffect, useState } from "react";
import {
  usePageTransition,
  COVER_TRANSITION_MS,
  COVER_STAGGER_MS,
  REVEAL_TRANSITION_MS,
  REVEAL_STAGGER_MS,
} from "./page-transition-context";

// Grid density — a real 2D mosaic, not a handful of full-height bars.
// Roughly square cells at common viewport widths (1440/8 = 180,
// 900/6 = 150), matching the reference's own actual technique: a CSS
// grid of plain blocks (live-tested rudeingenierie.com directly —
// its .transition-block grid is 7 cols x 6 rows).
const COLS = 8;
const ROWS = 6;
const CELL_COUNT = COLS * ROWS;
const ROW_STEP = ROWS > 1 ? 1 / (ROWS - 1) : 0;
// How much of a cell's delay comes from its row (a directional trend)
// vs. pure per-cell randomness — brainstormed direct follow-up: v5's
// row-plus-jitter formula still leaned mostly on row order, closer to
// "bands with soft edges" than genuine pixel scatter. Flipping the mix
// so randomness dominates and the row only supplies a faint bias is
// what makes it read as noise with a direction, not a wipe with jitter.
const DIRECTIONAL_WEIGHT = 0.3;

// v5 — direct follow-up ("it just looks like a orange slab moves over
// the page i really want it to have the pixel effect"). v2-v4 slid a
// handful of full-viewport-height bars in via `transform`, which reads
// as one solid mass in motion no matter how it's staggered or paced.
// This is a real 2D grid of small blocks instead, each toggling plain
// `opacity` IN PLACE — nothing ever travels across the screen, so
// mid-transition genuinely shows a mosaic of blocks in different
// states, not a slab. `direction` only shifts the random-delay mix's
// faint bias (top-first for "forward", bottom-first for "back") — a
// pure timing value, not a position, so there's no positional
// entry/exit concept left to get wrong (see page-transition-
// context.tsx's own comment on the class of bug that retires).
export default function PageTransitionOverlay() {
  const { phase, direction } = usePageTransition();

  // Stable per-cell random delay fraction (0..1), rolled once on mount
  // rather than re-rolled every trigger — keeps the scattered read
  // consistent across repeated transitions instead of an arbitrary new
  // pattern every click. Math.random() can't run during render (impure)
  // and a plain setState call directly in an effect body isn't allowed
  // either — nesting it in the timeout callback satisfies both (the
  // same wall the very first version of this overlay hit — see git
  // history).
  const [randomDelays, setRandomDelays] = useState<number[]>([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRandomDelays(Array.from({ length: CELL_COUNT }, () => Math.random()));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const visible = phase === "covering";
  const staggerMs = phase === "revealing" ? REVEAL_STAGGER_MS : COVER_STAGGER_MS;
  const transitionMs = phase === "revealing" ? REVEAL_TRANSITION_MS : COVER_TRANSITION_MS;

  return (
    <div className="page-transition-overlay" aria-hidden="true">
      <div className="page-transition-grid">
        {Array.from({ length: CELL_COUNT }, (_, i) => {
          const row = Math.floor(i / COLS);
          const rowFraction = row * ROW_STEP;
          // forward: row 0 (top) biased first, last row lags — reads as
          // filling in from the top. back: reversed — bottom fills first.
          const baseFraction = direction === "forward" ? rowFraction : 1 - rowFraction;
          const random = randomDelays[i] ?? 0.5; // defaults to the midpoint pre-mount
          const delayFraction = baseFraction * DIRECTIONAL_WEIGHT + random * (1 - DIRECTIONAL_WEIGHT);
          return (
            <div
              key={i}
              className="page-transition-block"
              style={{
                opacity: visible ? 1 : 0,
                transitionDuration: `${transitionMs}ms`,
                transitionDelay: `${delayFraction * staggerMs}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
