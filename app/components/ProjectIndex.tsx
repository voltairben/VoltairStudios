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
  const { activeIndex, morphSource, setMorphSource } = useProjectShowcase();
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
            className={`project-index-item${i === activeIndex ? " is-active" : ""}`}
            aria-current={i === activeIndex ? "true" : undefined}
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
