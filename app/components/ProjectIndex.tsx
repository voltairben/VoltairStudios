"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useProjectShowcase } from "./project-showcase-context";
import { usePageTransition } from "./page-transition-context";
import { PROJECTS } from "../data/projects";

const REAL_PROJECT_COUNT = 2; // matches ProjectReel.tsx's own PROJECTS.slice(0, 2)

// Direct request: keep all 6 slots for composition/grid balance even
// though only the first 2 are real, finished case studies — items 3-6
// render as inert "coming soon" anchors instead of disappearing, so
// the list doesn't visually collapse to a lopsided 2-item column.
export default function ProjectIndex() {
  const { trigger } = usePageTransition();
  const router = useRouter();
  const { hoveredSlug, setHoveredSlug } = useProjectShowcase();

  return (
    <aside className="project-index" role="region" aria-label="Project index">
      <span className="project-index-label">Index</span>
      <div className="project-index-list">
        {PROJECTS.map((project, i) => {
          if (i >= REAL_PROJECT_COUNT) {
            // Static structural anchor, not a link — no href, no
            // onClick/onMouseEnter/onFocus, tabIndex={-1} so it can
            // never receive keyboard focus (Tab flows straight from
            // SOL_DNB to whatever's next in the DOM, e.g. the status
            // bar's own links), and .project-index-item-placeholder's
            // own `pointer-events: none` backstops the "no hover/click
            // reaction at all" ask even though a plain non-interactive
            // <span> already doesn't react to either on its own —
            // explicit here rather than relying on that implicitly.
            return (
              <span
                key={project.slug}
                className="project-index-item project-index-item-placeholder"
                tabIndex={-1}
              >
                {`[ SLOT_0${i + 1} // COMING SOON ]`}
              </span>
            );
          }
          return (
            <Link
              href={`/work/${project.slug}`}
              key={project.slug}
              className={`project-index-item${
                hoveredSlug === project.slug ? " is-cross-hovered" : ""
              }`}
              // Bidirectional hover — direct request; the reel side of
              // this is in ProjectReel.tsx. onFocus/onBlur alongside
              // the mouse handlers for the kinetic hover-expansion
              // feature's own "fully support keyboard focus
              // transitions" ask — Tab-focusing an item drives the
              // exact same is-cross-hovered state a mouse hover (or
              // hovering the matching reel tile) does.
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onFocus={() => setHoveredSlug(project.slug)}
              onBlur={() => setHoveredSlug(null)}
              onClick={(e) => {
                // trigger() owns navigation timing — see
                // ProjectReel.tsx's identical comment for the full
                // "why", including why this is a plain useRouter() and
                // not useTransitionRouter().
                e.preventDefault();
                const slug = project.slug;
                trigger("forward", () => router.push(`/work/${slug}`));
              }}
            >
              {project.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
