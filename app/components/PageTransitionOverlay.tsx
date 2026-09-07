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

// Grid density for the block-wipe mask — a regular grid, not the
// reference's own irregular block sizing (a real simplification,
// disclosed: variable-sized cells would need real layout math per
// cell rather than a uniform percentage grid). What carries the
// reference's actual "scattered mosaic" quality is the per-cell
// randomized timing below, not the cell shapes themselves.
const COLS = 10;
const ROWS = 6;
const CELL_COUNT = COLS * ROWS;

// ::view-transition-old/new(name) are UA-rasterized snapshots of the
// real page, not live DOM — CSS can animate their position/opacity,
// but can't put a live WebGL canvas or a real animated SVG mask
// "inside" one, and background-image on them paints behind their own
// snapshot content, not in place of it (checked directly against the
// spec's own pseudo-element model before building this, not assumed).
// A plain fixed overlay sidesteps that entirely: this IS live DOM, so
// a real <canvas> and a real animated <mask> both just work.
export default function PageTransitionOverlay() {
  const { phase } = usePageTransition();
  const [shaderMounted, setShaderMounted] = useState(false);

  // Mount synchronously the moment a transition starts — a React-
  // endorsed "adjust state during render" call (not an effect), so it
  // takes effect the same render instead of one tick late.
  if (phase !== "idle" && !shaderMounted) {
    setShaderMounted(true);
  }

  useEffect(() => {
    if (phase !== "idle") return;
    // Free the WebGL context once fully idle again — same "don't run a
    // live shader behind nothing" discipline LoadingScreen's own
    // shaderMounted flag already uses. Nested in the timeout callback
    // (not the effect body) so this setState is a reaction to a real
    // timer event, not a synchronous effect-body update.
    const timeout = setTimeout(() => setShaderMounted(false), 0);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Stable per-cell random delay fractions (0..1), rolled once on
  // mount rather than re-rolled every trigger — keeps the "scattered"
  // read consistent across repeated transitions instead of an
  // arbitrary new pattern every click. Math.random() can't run during
  // render (impure) and a plain setState call directly in an effect
  // body isn't allowed either — nesting it in the timeout callback
  // (mirroring the shaderMounted-false effect above) satisfies both;
  // by the time a user can actually trigger a transition (well after
  // mount), this has long since populated real state.
  const [cellDelayFractions, setCellDelayFractions] = useState<number[]>([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCellDelayFractions(Array.from({ length: CELL_COUNT }, () => Math.random()));
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const visible = phase === "covering";
  const staggerMs = phase === "revealing" ? REVEAL_STAGGER_MS : COVER_STAGGER_MS;
  const transitionMs = phase === "revealing" ? REVEAL_TRANSITION_MS : COVER_TRANSITION_MS;

  return (
    <div className="page-transition-overlay" aria-hidden="true">
      {/* The mask's <rect>s below stay permanently mounted (never
          conditionally rendered) — only the WebGL canvas mounts/
          unmounts with shaderMounted. A <rect> that mounts FRESH
          already at its target opacity has nothing to transition
          FROM (a brand-new DOM node just paints its initial style;
          CSS transitions only fire on a style CHANGE to an element
          already in the tree) — that bug shipped the very first
          build of this as a solid, un-staggered block with no grid
          visible at all. Keeping them mounted the whole time means a
          real trigger is a genuine 0→1 (or 1→0) change on existing
          nodes, so the per-cell stagger actually animates. */}
      {shaderMounted && <LoadingShader />}
      <svg className="page-transition-mask-svg" width="0" height="0" aria-hidden="true">
        <defs>
          <mask id="page-transition-mask" maskContentUnits="objectBoundingBox" maskUnits="objectBoundingBox">
            {cellDelayFractions.map((frac, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              return (
                <rect
                  key={i}
                  x={col / COLS}
                  y={row / ROWS}
                  width={1 / COLS}
                  height={1 / ROWS}
                  fill="#fff"
                  className="page-transition-mask-rect"
                  style={{
                    opacity: visible ? 1 : 0,
                    transitionDuration: `${transitionMs}ms`,
                    transitionDelay: `${frac * staggerMs}ms`,
                  }}
                />
              );
            })}
          </mask>
        </defs>
      </svg>
    </div>
  );
}
