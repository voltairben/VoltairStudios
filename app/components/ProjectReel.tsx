"use client";

import { Link } from "next-view-transitions";
import Image from "next/image";
import { flushSync } from "react-dom";
import {
  useEffect,
  useRef,
  useState,
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
const REPEAT_COUNT = 6; // duplicated copies of the item list. Was 3,
  // sized assuming a single copy's own height would always comfortably
  // exceed the reel's visible height — true at normal aspect ratios,
  // but the reel's width (and so each tile's aspect-ratio height)
  // scales with viewport *width* while its visible height scales with
  // viewport *height*, independently — a narrow-but-tall window can
  // shrink one copy's height below the reel's own visible height,
  // which the old fixed "-2 * single" wrap bound didn't account for
  // at all (see wrapAndApply below, which now checks the real
  // clientHeight instead of assuming it). Doubled for real margin.

export default function ProjectReel() {
  const { reportActiveIndex, morphSource, setMorphSource, hoveredSlug, setHoveredSlug } =
    useProjectShowcase();
  const reelRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Card-to-page morph target: PROJECTS repeats REPEAT_COUNT times in the
  // DOM at once (see `looped` below), so a shared view-transition-name
  // can't just live on every copy's label — the browser rejects duplicate
  // names within one document snapshot. Only the one physical <span> the
  // user actually clicked gets tagged; every other copy renders a plain
  // untagged span. `morphIndex` is an index into `looped`, not PROJECTS.
  const [morphIndex, setMorphIndex] = useState<number | null>(null);
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
    const reel = reelRef.current;
    const single = singleSetHeightRef.current;
    if (!track || !reel || !single) return;
    // The true safety bound, not an assumption about it: the visible
    // window is [-offset, -offset + clientHeight], and it must stay
    // within [0, trackTotalHeight] at all times, or there's real
    // content missing from view (a gap). An earlier version wrapped at
    // a fixed "-2 * single", implicitly assuming clientHeight is
    // always comfortably smaller than a single copy's own height —
    // true most of the time, but not guaranteed (see REPEAT_COUNT's
    // comment above). Computing the bound from the actual measured
    // clientHeight closes that gap outright instead of hoping the
    // margin is wide enough.
    const trackTotalHeight = single * REPEAT_COUNT;
    const minOffset = reel.clientHeight - trackTotalHeight;
    while (offsetRef.current < minOffset) offsetRef.current += single;
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

    const measure = () => {
      const singleSetHeight = track.scrollHeight / REPEAT_COUNT;
      if (singleSetHeight <= 0) return; // not laid out yet
      singleSetHeightRef.current = singleSetHeight;
      speedPxPerMsRef.current = singleSetHeight / CYCLE_MS;
    };
    measure();
    offsetRef.current = -singleSetHeightRef.current; // start in the middle copy
    wrapAndApply();

    // Re-measure whenever the track's real rendered height changes —
    // a window resize, browser zoom, DPI change, or a font-load reflow
    // can all shift each tile's height (it's aspect-ratio-derived from
    // the reel's own width), and this was previously measured ONCE at
    // mount with nothing keeping it current afterward. A stale cached
    // height desyncs wrapAndApply()'s safe-range math from what's
    // actually on screen — the likely cause of a real "cut off, sent
    // back to the start" report; this closes the whole class of bug
    // rather than one specific reproduction of it.
    const resizeObserver = new ResizeObserver(() => {
      measure();
      wrapAndApply(); // re-normalize the current offset into the
        // (possibly changed) safe range immediately, not next frame
    });
    resizeObserver.observe(track);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      return () => resizeObserver.disconnect();
      // drag/wheel handlers below still call wrapAndApply() directly,
      // so manual input keeps working — only the ambient per-frame
      // auto-advance is skipped
    }

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
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reverse-direction morph: the case-study page's back link encodes
  // which project it came from as a URL hash (`/#slug`) since a fresh
  // mount here has no other way to know which tile the browser should
  // pair against the case-study's outgoing <h1>. Mount-only — matches
  // the "start in the middle copy" offset above (copy index 1), so the
  // tagged instance is the one actually on screen at mount.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (!slug) return;
    const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
    if (projectIndex === -1) return;
    // One-time read of a real external system (the URL's own hash,
    // which doesn't exist as React state anywhere) to tag which
    // duplicated tile owns the reverse morph; not state derived from a prop.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMorphIndex(PROJECTS.length + projectIndex);
    setMorphSource("reel");
    history.replaceState(null, "", window.location.pathname + window.location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Native listener, not React's onWheel — real console warning, caught
  // live: modern React registers its own wheel listener as passive by
  // default (matching the browser's own default for scroll-performance
  // reasons), so a plain onWheel handler's preventDefault() is silently
  // ignored ("Ignoring 'preventDefault()' call on event of type 'wheel'
  // from a listener registered as passive"). The manual wheel-to-scroll
  // interaction still worked regardless — .page's own overflow:hidden
  // was already backstopping any leaked default page-scroll — but a
  // known, real console warning with a known fix isn't worth leaving
  // there just because nothing visibly broke. { passive: false } here
  // is what actually lets preventDefault take effect.
  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      offsetRef.current -= e.deltaY;
      wrapAndApply();
    };
    reel.addEventListener("wheel", onWheel, { passive: false });
    return () => reel.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <div className="project-reel-track" ref={trackRef}>
        {looped.map((project, i) => (
          <Link
            href={`/work/${project.slug}`}
            className={`project-reel-item${project.image ? " has-image" : ""}${
              hoveredSlug === project.slug ? " is-cross-hovered" : ""
            }`}
            key={i}
            // Bidirectional hover — direct request. Matches on slug, not
            // index i, since REPEAT_COUNT duplicates every project 6x for
            // the loop illusion: whichever copy the pointer is actually
            // over sets it, and every copy (plus the index's one entry)
            // reads the same shared value back, so all of them light up
            // together, not just the one under the cursor.
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            onClick={() => {
              // next-view-transitions' Link calls our onClick, THEN
              // synchronously calls document.startViewTransition — a
              // plain setState here wouldn't paint until after that
              // (React defers commits from event handlers), so the
              // browser would snapshot the "old" DOM with nothing
              // tagged yet and the morph would silently degrade to a
              // plain fade. flushSync forces the commit to happen
              // before this handler returns.
              flushSync(() => {
                setMorphIndex(i);
                setMorphSource("reel");
              });
            }}
          >
            {project.image && (
              <Image
                src={project.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="380px"
                className="project-reel-item-image"
                // Real Next.js warning, caught live: the reel mounts
                // scrolled to copy index 1 (see the mount effect's own
                // "start in the middle copy" comment), so a tile's
                // image there — not copy 0 — is what's actually visible
                // (and became the page's detected LCP element) at load.
                // Scoped to just that one real copy, not every
                // REPEAT_COUNT duplicate: the other 5 sets never paint
                // on load, so eagerly prioritizing their images too
                // would just be wasted bandwidth for no LCP benefit.
                priority={Math.floor(i / PROJECTS.length) === 1}
              />
            )}
            {project.image && <span className="project-reel-item-scrim" aria-hidden="true" />}
            <span
              className="project-reel-label"
              style={
                i === morphIndex && morphSource === "reel"
                  ? { viewTransitionName: `project-title-${project.slug}` }
                  : undefined
              }
            >
              {project.name}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
