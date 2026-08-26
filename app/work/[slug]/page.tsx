import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "../../data/projects";
import EstrelaCardViewer from "../../components/EstrelaCardViewer";
import ChromeBar from "../../components/ChromeBar";
import StatusBar from "../../components/StatusBar";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.name} — Voltair Studio` : "Voltair Studio" };
}

// A real destination for the reel/index links to point at (segerman.dev's
// own project tiles and index both navigate to real case-study pages —
// this is that, for us). Most slots are still placeholders (PRODUCT.md:
// no fabricated case studies), rendering an honest "in progress" line —
// see data/projects.ts for how a real one (an optional `url`/`mockups`)
// swaps that out for a real link and real screenshots instead.
// Deliberately outside .page's zero-scroll layout: a real case study is
// exactly the kind of content a normal scrolling page suits, not a
// single fixed viewport — kept that way on direct request even after a
// prompt asked to lock this into the fixed-viewport HUD grid instead.
export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Circular "next project" — wraps from the last slot back to the first.
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  const nextProject = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <>
      {/* Same ChromeBar/StatusBar as the homepage, in the same visual
          position (top/bottom of the viewport) — direct request: a
          visitor should always have access to the same nav/flags/skybox
          switcher regardless of which page they're on. .page's own
          grid-row positioning doesn't apply here (this isn't a zero-
          scroll grid page), so both are fixed instead — see globals.css.
          This also replaces the one-off fixed skybox-only button from
          the previous round: StatusBar already carries that switcher,
          so a second, separate control would've just duplicated it. */}
      <div className="case-study-chrome">
        <ChromeBar />
      </div>
      <main className="case-study">
        <div className="case-study-layout">
          <div className="case-study-text">
            {/* Hash carries which project this was so ProjectReel (a fresh
                mount on "/") knows which of its 6 duplicated copies to tag
                with the matching view-transition-name for the reverse
                morph — see ProjectReel.tsx's hash-read effect. */}
            <Link href={`/#${project.slug}`} className="case-study-back">
              ← voltair_studio
            </Link>
            <h1
              className="case-study-title"
              style={{ viewTransitionName: `project-title-${project.slug}` }}
            >
              {project.name}
            </h1>
            {project.description ? (
              <p className="case-study-body">{project.description}</p>
            ) : !project.url ? (
              <p className="case-study-body">
                Case study in progress — check back soon.
              </p>
            ) : null}
            <a href="mailto:contact@voltairstudio.com" className="case-study-cta">
              contact@voltairstudio.com
            </a>
          </div>
          <div className="case-study-mockup">
            <EstrelaCardViewer project={project} />
          </div>
        </div>

        {/* segerman.dev-style info bar, direct request/reference —
            originally Year / Role / Visit / Next Project. Visit and
            Year moved out twice since: first into StatusBar's flag
            row, then back out of it into their own centered block
            below (direct request both times — StatusBar was the wrong
            location even though the flag styling was fine; see
            .case-study-visit-year further down). What's left here is
            Role / Next Project. Role is a real Project field, unset
            for every project so far (nothing fabricated to fill it),
            so that column only renders when there's real data behind
            it. Next Project always renders — even a placeholder has a
            real next slug — and reuses Project.image for its
            thumbnail exactly like the reel tiles do. */}
        <div className="case-study-infobar">
          <div className="case-study-infobar-left">
            {project.role && (
              <div className="case-study-infobar-item">
                <span className="case-study-infobar-label">Role</span>
                <span className="case-study-infobar-value">{project.role}</span>
              </div>
            )}
          </div>
          <Link
            href={`/work/${nextProject.slug}`}
            className="case-study-infobar-next"
          >
            <span className="case-study-infobar-thumb">
              {nextProject.image ? (
                <Image src={nextProject.image} alt="" fill sizes="64px" />
              ) : (
                <span className="case-study-infobar-thumb-empty" aria-hidden="true" />
              )}
            </span>
            <span className="case-study-infobar-text">
              <span className="case-study-infobar-label">Next Project</span>
              <span className="case-study-infobar-value">{nextProject.name}</span>
            </span>
          </Link>
        </div>

        {/* Visit/Year, round 2 — direct request: pulled back out of
            StatusBar's flag row (wrong location, even though that
            style was fine) into their own centered block at the
            bottom of the page instead. Reuses the exact same label/
            value classes the info bar above already uses — the
            request was specifically to change WHERE this shows, not
            the label-over-value look itself. */}
        {(project.url || project.year) && (
          <div className="case-study-visit-year">
            {project.url && (
              <div className="case-study-infobar-item">
                <span className="case-study-infobar-label">Visit</span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-infobar-value case-study-infobar-link"
                >
                  Live site ↗
                </a>
              </div>
            )}
            {project.year && (
              <div className="case-study-infobar-item">
                <span className="case-study-infobar-label">Year</span>
                <span className="case-study-infobar-value">{project.year}</span>
              </div>
            )}
          </div>
        )}
      </main>
      <div className="case-study-footer">
        <StatusBar />
      </div>
    </>
  );
}
