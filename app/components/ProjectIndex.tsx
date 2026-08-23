"use client";

import Link from "next/link";
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
  const { activeIndex } = useProjectShowcase();

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
          >
            {project.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
