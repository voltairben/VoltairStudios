"use client";

import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProjectShowcase } from "./project-showcase-context";
import { usePageTransition } from "./page-transition-context";
import { PROJECTS } from "../data/projects";

// Pivot to a statically locked showcase — direct request: 2 real,
// finished case studies exist now (KrachtigFit, SOL_DNB), so this
// stops pretending to be an endless reel of "content goes here"
// placeholders and just shows the 2 real ones, stacked, always fully
// visible. Was a continuous auto-looping marquee with wheel/drag
// input (REPEAT_COUNT duplication, a JS-owned scroll position, a
// requestAnimationFrame tick, native wheel + pointer-drag handlers —
// see git history) — none of that has a purpose left once there's
// nothing to loop through or scroll past: two tiles, both always on
// screen, is a fully static layout. Each tile is still a real link to
// its /work/[slug] case study, matching how the reference's own
// project tiles work (confirmed via its DOM, not assumed).
export default function ProjectReel() {
  const { trigger } = usePageTransition();
  const router = useRouter();
  const { hoveredSlug, setHoveredSlug } = useProjectShowcase();

  // The only 2 real projects — ProjectIndex still shows all 6 slots
  // (4 "coming soon" placeholders keep the list's own composition
  // balance), but the reel itself only ever had a purpose for real,
  // finished work to show.
  const realProjects = PROJECTS.slice(0, 2);

  return (
    <aside className="project-reel" role="region" aria-label="Project previews">
      <div className="project-reel-track">
        {realProjects.map((project, i) => (
          <Link
            href={`/work/${project.slug}`}
            className={`project-reel-item${project.image ? " has-image" : ""}${
              hoveredSlug === project.slug ? " is-cross-hovered" : ""
            }`}
            key={project.slug}
            // Bidirectional hover — direct request: hovering this
            // project's Index entry pops this same tile back (see
            // ProjectIndex.tsx's own onMouseEnter/onFocus).
            onMouseEnter={() => setHoveredSlug(project.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
            onClick={(e) => {
              // trigger() owns navigation timing — real navigation no
              // longer fires immediately on click (see page-
              // transition-context.tsx's own comment on why a plain
              // Link's own default behavior raced the cover animation,
              // a real bug). "forward": a project case study is deeper
              // into the site, not a return trip. Plain useRouter()
              // (not useTransitionRouter()) — see TransitionLink.tsx's
              // own comment on why: the native View Transition this
              // used to drive (for the card-to-page title morph, now
              // removed) rendered in the browser's top layer, above
              // this overlay regardless of z-index, which was the real
              // cause of a "sees the destination header early" bug.
              e.preventDefault();
              const slug = project.slug;
              trigger("forward", () => router.push(`/work/${slug}`));
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
                // Only 2 real tiles now, both always on screen — the
                // top one is the reel's own LCP candidate.
                preload={i === 0}
              />
            )}
            {project.image && <span className="project-reel-item-scrim" aria-hidden="true" />}
            <span className="project-reel-label">{project.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
