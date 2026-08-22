"use client";

import { useEffect, useRef, useState } from "react";

const PLACEHOLDER_COUNT = 6;
// Matches .project-reel-track's own 26s loop / 6 items — see the CSS
// comment history; kept as the auto-advance pace now that it's JS-driven.
const AUTO_ADVANCE_MS = 26_000 / PLACEHOLDER_COUNT;

// Mirrors ProjectReel's placeholder reasoning: no real project names
// exist yet, so this lists generic, clearly-labeled placeholders rather
// than inventing project names. Swap in real names (and real links) the
// same day the reel gets real thumbnails.
//
// Clickable by direct request: each item is a real button — sets itself
// as the highlighted one and restarts the auto-advance cycle from
// there, so a click actually sticks instead of being overridden a
// moment later. There's no real per-project destination yet (no case
// pages exist), so a click's payoff is the highlight state itself, not
// navigation — the honest amount of interactivity available until real
// project content exists to link to.
export default function ProjectIndex() {
  const items = Array.from(
    { length: PLACEHOLDER_COUNT },
    (_, i) => `Placeholder ${i + 1}`,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startAutoAdvance = () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % PLACEHOLDER_COUNT);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
    startAutoAdvance(); // restart the cycle from here rather than let
    // the next automatic tick immediately override the click
  };

  return (
    <aside className="project-index">
      <span className="project-index-label">Index</span>
      <div className="project-index-list">
        {items.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`project-index-item${i === activeIndex ? " is-active" : ""}`}
            onClick={() => handleClick(i)}
          >
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
