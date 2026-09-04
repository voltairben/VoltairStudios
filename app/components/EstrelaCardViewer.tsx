"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Project } from "../data/projects";

// Consolidates what used to be ProjectMockupCard.tsx — a carousel is a
// strict superset of a single static card (1 slide = no nav controls
// needed), so keeping both would just be two copies of the same
// glass/tilt shell. See DESIGN.md.

// Max rotation in either axis — subtle on purpose, this is a legibility
// surface (real screenshots), not a toy; too much tilt just distorts
// the image and makes the site's own text hard to read at the edges.
const MAX_TILT_DEG = 8;

// Touch-drag inertia — direct request ("smooth touch-drag inertia" for
// carousel elements). Distance is a fraction of the card's own width
// (not a fixed px value, so it scales correctly from a 320px phone to
// a tablet); velocity is a real flick check so a fast short swipe
// still advances even if it didn't cross the distance threshold,
// matching how touch carousels actually behave elsewhere.
const SWIPE_DISTANCE_RATIO = 0.15;
const SWIPE_VELOCITY_PX_MS = 0.5;
// Below this, a touch hasn't shown its direction yet — keeps a near-
// straight-down scroll attempt from ever being misread as a tiny
// horizontal drag.
const AXIS_LOCK_PX = 6;

export default function EstrelaCardViewer({ project }: { project: Project }) {
  const mockups = project.mockups ?? [];
  const cardRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef<boolean | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Kept in sync via effect, not a bare assignment during render — a
  // ref write during render (the touch-drag effect below reads this
  // from event callbacks, well after paint, so the effect's slightly
  // later timing changes nothing in practice) is a real
  // react-hooks/refs violation, this isn't just a lint-appeasing move.
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current === null) {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    if (reducedMotionRef.current) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-x", `${(0.5 - py) * 2 * MAX_TILT_DEG}deg`);
    card.style.setProperty("--tilt-y", `${(px - 0.5) * 2 * MAX_TILT_DEG}deg`);
    card.style.setProperty("--tilt-scale", "1.02");
    card.style.setProperty("--shine-x", `${px * 100}%`);
    card.style.setProperty("--shine-y", `${py * 100}%`);
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--tilt-scale", "1");
  };

  const go = (delta: number) => {
    setActiveIndex((i) => (i + delta + mockups.length) % mockups.length);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (mockups.length < 2) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  // Keeps the track's transform in sync with activeIndex whenever it's
  // not mid-drag — imperative, matching how the mouse-tilt handlers
  // above already drive this component's other transforms via a ref
  // instead of through JSX's style prop. This is the only code path
  // that ever writes track.style.transform (settling to an index and
  // live-dragging both go through it below), rather than a JSX-driven
  // value and an imperative drag override fighting over the same
  // style property on every re-render.
  const isDraggingRef = useRef(false);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDraggingRef.current) return;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
  }, [activeIndex]);

  // Touch-drag, attached imperatively (not JSX onTouchMove) — React
  // registers touchstart/touchmove as passive at the root by default,
  // which silently ignores preventDefault() inside a synthetic handler
  // (a real, well-known gotcha for exactly this "swipe carousel inside
  // a scrolling page" case). A manual { passive: false } listener is
  // the only way preventDefault() actually stops page scroll once a
  // drag is confirmed horizontal — same pattern SkyboxCanvas.tsx's own
  // touch handling already uses for the same reason.
  useEffect(() => {
    const card = cardRef.current;
    if (!card || mockups.length < 2) return;

    let dragAxis: "x" | "y" | null = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastMoveTime = 0;
    let velocity = 0;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      lastX = touch.clientX;
      lastMoveTime = performance.now();
      velocity = 0;
      dragAxis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;

      if (dragAxis === null) {
        if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
        dragAxis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (dragAxis === "x") {
          isDraggingRef.current = true;
          card.classList.add("is-dragging");
        }
      }
      if (dragAxis !== "x") return; // vertical intent — leave it to the page's own scroll

      e.preventDefault(); // claims the gesture now that it's confirmed horizontal
      const now = performance.now();
      const dt = now - lastMoveTime;
      if (dt > 0) velocity = (touch.clientX - lastX) / dt;
      lastX = touch.clientX;
      lastMoveTime = now;

      const track = trackRef.current;
      const width = card.getBoundingClientRect().width || 1;
      if (track) {
        const percent = (dx / width) * 100;
        track.style.transform = `translateX(calc(-${activeIndexRef.current * 100}% + ${percent}%))`;
      }
    };

    const settle = () => {
      const track = trackRef.current;
      if (track) track.style.transform = `translateX(-${activeIndexRef.current * 100}%)`;
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) {
        dragAxis = null;
        return;
      }
      isDraggingRef.current = false;
      card.classList.remove("is-dragging");
      const width = card.getBoundingClientRect().width || 1;
      const dx = lastX - startX;
      const distanceRatio = Math.abs(dx) / width;
      const isFling = Math.abs(velocity) > SWIPE_VELOCITY_PX_MS;
      if (distanceRatio > SWIPE_DISTANCE_RATIO || isFling) {
        go(dx < 0 ? 1 : -1);
      } else {
        settle();
      }
      dragAxis = null;
    };

    card.addEventListener("touchstart", onTouchStart, { passive: true });
    card.addEventListener("touchmove", onTouchMove, { passive: false });
    card.addEventListener("touchend", onTouchEnd, { passive: true });
    card.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      card.removeEventListener("touchstart", onTouchStart);
      card.removeEventListener("touchmove", onTouchMove);
      card.removeEventListener("touchend", onTouchEnd);
      card.removeEventListener("touchcancel", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockups.length]);

  return (
    <div
      ref={cardRef}
      className="mockup-card"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      role={mockups.length > 0 ? "region" : undefined}
      aria-label={mockups.length > 0 ? `${project.name} screenshots` : undefined}
    >
      <div className="mockup-card-shine" aria-hidden="true" />

      {mockups.length === 0 ? (
        // No fabricated imagery for placeholder projects (PRODUCT.md) —
        // same "clearly-labeled empty slot" rule the reel tiles follow.
        <span className="mockup-card-empty">no preview yet</span>
      ) : (
        <>
          <div ref={trackRef} className="mockup-carousel-track">
            {mockups.map((m, i) => (
              <Image
                key={m.src}
                src={m.src}
                alt={`${project.name} — ${m.label}`}
                width={1440}
                height={900}
                className="mockup-card-image"
                // Card-to-page image morph target, matching the reel/
                // index thumbnail's own project-image-${slug} name (see
                // ProjectReel.tsx). Only the first slide — the carousel
                // always mounts at activeIndex 0, and a duplicate name
                // across multiple slides would be the same "browser
                // rejects duplicate view-transition-name" problem the
                // reel's own morphIndex state already exists to avoid,
                // just with a static index instead of click-tracked
                // state since (unlike the reel) this component only
                // ever renders one project's mockups at a time — no
                // duplicate copies to disambiguate between.
                style={i === 0 ? { viewTransitionName: `project-image-${project.slug}` } : undefined}
              />
            ))}
          </div>

          {mockups.length > 1 && (
            <>
              <button
                type="button"
                className="mockup-carousel-arrow mockup-carousel-arrow-prev"
                onClick={() => go(-1)}
                aria-label="Vorige screenshot"
              >
                ←
              </button>
              <button
                type="button"
                className="mockup-carousel-arrow mockup-carousel-arrow-next"
                onClick={() => go(1)}
                aria-label="Volgende screenshot"
              >
                →
              </button>
              <div className="mockup-carousel-dots">
                {mockups.map((m, i) => (
                  <button
                    key={m.src}
                    type="button"
                    className="mockup-carousel-dot"
                    aria-current={i === activeIndex ? "true" : undefined}
                    aria-label={`Ga naar ${m.label}`}
                    onClick={() => setActiveIndex(i)}
                  />
                ))}
              </div>
              {/* Visually hidden — screen readers get the slide change
                  announced without a visible duplicate of the label
                  already shown by the dot's own aria-label above. */}
              <span className="sr-only" aria-live="polite">
                {`Schermafbeelding ${activeIndex + 1} van ${mockups.length}: ${mockups[activeIndex].label}`}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
