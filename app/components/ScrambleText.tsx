"use client";

import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";
const HOVER_TICK_MS = 55; // re-roll cadence while hovered — fast enough to
  // read as noise, slow enough not to blur into an unreadable smear

export default function ScrambleText({
  text,
  className,
  delayMs = 0,
  durationMs = 450,
}: {
  text: string;
  className?: string;
  delayMs?: number;
  durationMs?: number;
}) {
  // SSR/initial render shows the real text — the scramble is a client-only
  // enhancement layered on top after mount, never the only way to read it.
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const hoverIntervalRef = useRef<number | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotionRef.current) return;

    let cancelled = false;
    const start = performance.now() + delayMs;

    const tick = (now: number) => {
      if (cancelled) return;
      if (now < start) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min((now - start) / durationMs, 1);
      const revealed = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        next +=
          i < revealed
            ? text[i]
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [text, delayMs, durationMs]);

  // Stop any hover scramble left running if the component unmounts mid-hover.
  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current !== null) {
        window.clearInterval(hoverIntervalRef.current);
      }
    };
  }, []);

  // Continuous distortion while the pointer stays over the word — every
  // glyph re-rolls on each tick, reverting to the real text the instant
  // the pointer leaves. Same reduced-motion gate as the mount decode.
  const startHoverScramble = () => {
    if (reducedMotionRef.current || hoverIntervalRef.current !== null) return;
    hoverIntervalRef.current = window.setInterval(() => {
      let next = "";
      for (let i = 0; i < text.length; i++) {
        next +=
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(next);
    }, HOVER_TICK_MS);
  };

  const stopHoverScramble = () => {
    if (hoverIntervalRef.current !== null) {
      window.clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }
    setDisplay(text);
  };

  return (
    <span
      className={className}
      aria-label={text}
      onMouseEnter={startHoverScramble}
      onMouseLeave={stopHoverScramble}
    >
      {/* Screen readers get the stable aria-label above; the scrambling
          visual noise is hidden from them entirely, not read character
          by character as it cycles. Paint properties like a gradient
          fill don't inherit from the wrapper the way `color` does, so
          anything that needs to style the actual glyphs (not just the
          layout box) targets this inner span, not the outer one. */}
      <span className="scramble-glyphs" aria-hidden="true">
        {display}
      </span>
    </span>
  );
}
