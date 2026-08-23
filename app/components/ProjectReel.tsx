"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type WheelEvent as ReactWheelEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useProjectShowcase } from "./project-showcase-context";
import { PROJECTS } from "../data/projects";

// No real project screenshots exist yet (see PRODUCT.md — nothing gets
// fabricated in their place). This renders clearly-labeled placeholder
// slots instead, sized the way the real thumbnails will be once they
// exist, so swapping them in later is a content change, not a layout
// one. Each tile is a real link to its /work/[slug] case-study page —
// segerman.dev's own project tiles work the same way (real navigation,
// not decoration), confirmed by inspecting the reference's actual DOM
// rather than assuming.
//
// Continuous auto-advance AND real user scroll/drag, at the same time —
// the last version got here by simply layering native `overflow-y:auto`
// on top of a CSS `@keyframes` animation, which composed for free but
// had a real bug: the CSS loop's own translateY range (0 to -50% of the
// track) was tuned assuming nothing else was offsetting the content,
// but a real scrollTop adds its own independent offset on top — at the
// combined worst case (deep scroll + the animation near its own extreme)
// the two together exceeded the track's actual duplicated height,
// exposing blank space where there was no more content to show
// (screenshotted directly by the user — a hard cutoff below the last
// visible tile, not a smooth fade). Two independent, unbounded offset
// sources can't safely share one finite strip of duplicated content.
//
// Fixed properly instead of patched: ONE JS-owned position (offsetRef)
// that auto-advance, wheel, and drag all move together, kept inside a
// safe range via wraparound — jumping by exactly one duplicated copy's
// height whenever it nears either edge, invisible since every copy is
// pixel-identical. This is the standard technique for an infinite
// marquee that also takes real input; a plain CSS animation or plain
// native scroll alone can't do both at once.
const CYCLE_MS = 26_000; // time for auto-advance alone to move through
  // one full copy's height — matches the previous CSS animation's pace
const REPEAT_COUNT = 3; // duplicated copies of the item list — starting
  // in the middle one leaves a full copy's worth of slack above AND
  // below before a wrap is ever needed, room enough for any realistic
  // combination of auto-advance drift plus a user's own scroll/drag

export default function ProjectReel() {
  const { reportActiveIndex } = useProjectShowcase();
  const reelRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0); // current translateY in px, always <= 0
  const singleSetHeightRef = useRef(0);
  const speedPxPerMsRef = useRef(0);
  const dragRef = useRef<{
    startY: number;
    startOffset: number;
    pointerId: number;
    dragging: boolean;
  } | null>(null);

  const wrapAndApply = () => {
    const track = trackRef.current;
    const single = singleSetHeightRef.current;
    if (!track || !single) return;
    // Keep offset within (-2 * single, 0] — jump a whole copy-height at
    // a time when it drifts past either edge, invisible since every
    // copy renders identically.
    while (offsetRef.current <= -single * 2) offsetRef.current += single;
    while (offsetRef.current > 0) offsetRef.current -= single;
    track.style.transform = `translateY(${offsetRef.current}px)`;

    const progress = -offsetRef.current % single; // 0..single
    const idx = Math.min(
      PROJECTS.length - 1,
      Math.floor((progress / single) * PROJECTS.length),
    );
    reportActiveIndex(idx);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const singleSetHeight = track.scrollHeight / REPEAT_COUNT;
    singleSetHeightRef.current = singleSetHeight;
    speedPxPerMsRef.current = singleSetHeight / CYCLE_MS;
    offsetRef.current = -singleSetHeight; // start in the middle copy
    wrapAndApply();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return; // drag/wheel handlers below still call
      // wrapAndApply() directly, so manual input keeps working — only
      // the ambient per-frame auto-advance is skipped

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      offsetRef.current -= speedPxPerMsRef.current * dt;
      wrapAndApply();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWheel = (e: ReactWheelEvent<HTMLElement>) => {
    e.preventDefault();
    offsetRef.current -= e.deltaY;
    wrapAndApply();
  };

  // Drag-threshold, not an immediate capture-on-down: a real link sits
  // under every pixel of this reel, and calling setPointerCapture()
  // unconditionally on pointerdown redirects the resulting click to
  // this container instead of the link (measured directly — it broke
  // every real navigation). Only once the pointer has actually moved
  // past DRAG_THRESHOLD_PX do we treat it as a drag and capture; a
  // plain click/tap never captures at all, so it reaches the link
  // exactly like it would with no drag handling present.
  const DRAG_THRESHOLD_PX = 5;
  const handlePointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    dragRef.current = {
      startY: e.clientY,
      startOffset: offsetRef.current,
      pointerId: e.pointerId,
      dragging: false,
    };
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = e.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(dy) < DRAG_THRESHOLD_PX) return;
      drag.dragging = true;
      reelRef.current?.setPointerCapture(drag.pointerId);
    }
    offsetRef.current = drag.startOffset + dy;
    wrapAndApply();
  };
  const endDrag = () => {
    if (dragRef.current?.dragging) {
      reelRef.current?.releasePointerCapture(dragRef.current.pointerId);
    }
    dragRef.current = null;
  };

  const looped = Array.from({ length: REPEAT_COUNT }, () => PROJECTS).flat();

  return (
    <aside
      className="project-reel"
      role="region"
      aria-label="Project previews"
      ref={reelRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <div className="project-reel-track" ref={trackRef}>
        {looped.map((project, i) => (
          <Link href={`/work/${project.slug}`} className="project-reel-item" key={i}>
            <span className="project-reel-label">{project.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
