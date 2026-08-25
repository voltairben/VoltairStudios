"use client";

import { useEffect, useRef } from "react";

// How far from the headline's center the weight bottoms out at
// MIN_WEIGHT — picked as roughly half a common viewport width, so
// hovering anywhere reasonably near the headline pulls it toward bold,
// while the far side of the screen (over the project reel) reads thin.
const MAX_DISTANCE_PX = 600;
const MIN_WEIGHT = 100; // far away — ultra-thin
const MAX_WEIGHT = 700; // directly hovering — bold display, matches
  // .headline's own static font-weight:700 (see globals.css fallback)

function weightForDistance(distance: number) {
  const t = Math.min(distance / MAX_DISTANCE_PX, 1); // 0 (close) .. 1 (far)
  return Math.round(MAX_WEIGHT - t * (MAX_WEIGHT - MIN_WEIGHT));
}

function distanceToCenter(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect();
  return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
}

// Behavior-only — no markup of its own. Writes --weight-creative /
// --weight-designers onto :root every frame the mouse moves; globals.css
// reads them with a `, 700` fallback, so until the first real mousemove
// (or under reduced motion, ever) the headline just renders at its
// normal static weight — no "thin on load" flash before any input.
export default function KineticTypography() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const creative = document.querySelector<HTMLElement>(".type-target");
    const designers = document.querySelector<HTMLElement>(".headline-line2");
    if (!creative || !designers) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      hasMovedRef.current = true;
    };
    // Pointer leaving the viewport entirely relaxes back to the CSS
    // fallback (bold) rather than freezing at whatever weight it last
    // had at the edge — documentElement's mouseleave only fires on a
    // true viewport exit, not on moving between child elements.
    const onMouseLeave = () => {
      hasMovedRef.current = false;
      root.style.removeProperty("--weight-creative");
      root.style.removeProperty("--weight-designers");
    };
    window.addEventListener("mousemove", onMouseMove);
    root.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    const tick = () => {
      if (hasMovedRef.current) {
        const { x, y } = mouseRef.current;
        root.style.setProperty(
          "--weight-creative",
          String(weightForDistance(distanceToCenter(creative, x, y))),
        );
        root.style.setProperty(
          "--weight-designers",
          String(weightForDistance(distanceToCenter(designers, x, y))),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onMouseLeave);
      root.style.removeProperty("--weight-creative");
      root.style.removeProperty("--weight-designers");
    };
  }, []);

  return null;
}
