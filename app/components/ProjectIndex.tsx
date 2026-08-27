"use client";

import { Link } from "next-view-transitions";
import { flushSync } from "react-dom";
import { useState } from "react";
import { useProjectShowcase } from "./project-showcase-context";
import { PROJECTS } from "../data/projects";

// Mirrors ProjectReel's placeholder reasoning: no real project names
// exist yet, so this lists generic, clearly-labeled placeholders rather
// than inventing project names. Swap in real names (and the same real
// links stay, just pointed at real case studies) the same day the reel
// gets real thumbnails.
//
// Real navigation, matching the reference's own project-title links
// (confirmed by inspecting segerman.dev's DOM directly, not assumed).
// Still visually synced with the reel via ProjectShowcaseContext: the
// active item here tracks the reel's own continuous CSS auto-loop (see
// ProjectReel.tsx — both derive activeIndex from the same shared
// elapsed-time formula, not a scroll position, since the reel doesn't
// have one anymore).
export default function ProjectIndex() {
  const { activeIndex, morphSource, setMorphSource, hoveredSlug, setHoveredSlug } =
    useProjectShowcase();
  // Which project (by slug) this list should tag for the card-to-page
  // morph — unlike ProjectReel there's no duplicate-instance problem
  // here (PROJECTS.map renders each project exactly once), but the same
  // project is also always visible in the reel at the same time, so
  // morphSource still gates which of the two surfaces owns the name —
  // see project-showcase-context.tsx.
  const [morphSlug, setMorphSlug] = useState<string | null>(null);

  return (
    <aside className="project-index" role="region" aria-label="Project index">
      <span className="project-index-label">Index</span>
      <div className="project-index-list">
        {PROJECTS.map((project, i) => (
          <Link
            href={`/work/${project.slug}`}
            key={project.slug}
            className={`project-index-item${i === activeIndex ? " is-active" : ""}${
              hoveredSlug === project.slug ? " is-cross-hovered" : ""
            }`}
            aria-current={i === activeIndex ? "true" : undefined}
            // Bidirectional hover — direct request; the reel side of this
            // is in ProjectReel.tsx. is-active (activeIndex) and
            // is-cross-hovered (hoveredSlug) are deliberately separate
            // state/classes — "the reel is ambiently showing this" and
            // "the pointer is engaging with this" aren't the same thing
            // and can both be true, or neither, independently.
            // onFocus/onBlur added alongside the mouse handlers for the
            // kinetic hover-expansion feature's own "fully support
            // keyboard focus transitions" ask — Tab-focusing an item now
            // drives the exact same is-cross-hovered state a mouse
            // hover (or hovering the matching reel tile) does, so the
            // list-wide dim/expand effect below has one real trigger to
            // key off, not three separately-handled ones that could
            // drift out of sync with each other.
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            onFocus={() => setHoveredSlug(project.slug)}
            onBlur={() => setHoveredSlug(null)}
            onClick={() => {
              // See ProjectReel.tsx's identical comment — flushSync is
              // required so the tag is actually painted before
              // next-view-transitions calls document.startViewTransition.
              flushSync(() => {
                setMorphSlug(project.slug);
                setMorphSource("index");
              });
            }}
            style={
              project.slug === morphSlug && morphSource === "index"
                ? { viewTransitionName: `project-title-${project.slug}` }
                : undefined
            }
          >
            {project.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
