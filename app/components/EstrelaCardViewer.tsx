"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Project } from "../data/projects";

// Consolidates what used to be ProjectMockupCard.tsx — a carousel is a
// strict superset of a single static card (1 slide = no nav controls
// needed), so keeping both would just be two copies of the same
// glass/tilt shell. See DESIGN.md.

// Max rotation in either axis — subtle on purpose, this is a legibility
// surface (real screenshots), not a toy; too much tilt just distorts
// the image and makes the site's own text hard to read at the edges.
const MAX_TILT_DEG = 8;

export default function EstrelaCardViewer({ project }: { project: Project }) {
  const mockups = project.mockups ?? [];
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef<boolean | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
          <div
            className="mockup-carousel-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {mockups.map((m) => (
              <Image
                key={m.src}
                src={m.src}
                alt={`${project.name} — ${m.label}`}
                width={1440}
                height={900}
                className="mockup-card-image"
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
