import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "../../data/projects";
import EstrelaCardViewer from "../../components/EstrelaCardViewer";
import ChromeBar from "../../components/ChromeBar";
import StatusBar from "../../components/StatusBar";
import T from "../../components/T";
import Localized from "../../components/Localized";
import { STUDIO_HANDLE } from "../../data/brand";

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
      <div className="scroll-page-chrome">
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
              ← {STUDIO_HANDLE}
            </Link>
            <h1
              className="case-study-title"
              style={{ viewTransitionName: `project-title-${project.slug}` }}
            >
              {project.name}
            </h1>
            {project.description ? (
              <p className="case-study-body">
                <Localized en={project.description.en} nl={project.description.nl} />
              </p>
            ) : !project.url ? (
              <p className="case-study-body">
                <T k="work.inProgress" />
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
                <span className="case-study-infobar-label">
                  <T k="work.role" />
                </span>
                <span className="case-study-infobar-value">{project.role}</span>
              </div>
            )}
          </div>
          {/* Card-to-page morph, direct request ("for every page") —
              same project-title-${slug}/project-image-${slug} names the
              reel/index use, no click-tracking state needed here unlike
              those: this link is the only instance of the "next
              project" on the page (no REPEAT_COUNT-style duplicates to
              disambiguate between), so the names can just be static
              instead of set imperatively on click. Always a different
              slug than this page's own (project.slug), never the
              current page's own project-title/-image name, so nothing
              here can collide with this page's own <h1>/mockup tags. */}
          <Link
            href={`/work/${nextProject.slug}`}
            className="case-study-infobar-next"
          >
            <span
              className="case-study-infobar-thumb"
              style={
                // Only when there's a real mockup to land on — a
                // placeholder next-project's own case-study page never
                // tags anything with this name (EstrelaCardViewer skips
                // it when mockups.length is 0), so tagging this side
                // unconditionally would create a one-sided, unpaired
                // transition name for every placeholder pairing.
                nextProject.image
                  ? { viewTransitionName: `project-image-${nextProject.slug}` }
                  : undefined
              }
            >
              {nextProject.image ? (
                <Image src={nextProject.image} alt="" fill sizes="64px" />
              ) : (
                <span className="case-study-infobar-thumb-empty" aria-hidden="true" />
              )}
            </span>
            <span className="case-study-infobar-text">
              <span className="case-study-infobar-label">
                <T k="work.nextProject" />
              </span>
              <span
                className="case-study-infobar-value"
                style={{ viewTransitionName: `project-title-${nextProject.slug}` }}
              >
                {nextProject.name}
              </span>
            </span>
          </Link>
        </div>

        {/* Visit/Year, round 3 — direct request: always show both tags
            on every project page, placeholders included, instead of
            the whole block disappearing when there's no real url/year
            yet. The tags themselves are layout, not a claim — always
            showing "Visit"/"Year" doesn't assert a placeholder has a
            live site or a build year. Only the VALUE differs: a real
            project gets its real link/year exactly as before; a
            placeholder gets an honest non-link value instead of
            either a fabricated URL/date or a missing tag — "Coming
            soon" matches the same honest voice case-study-body already
            uses ("Case study in progress — check back soon."), and
            "—" is the standard convention for "no value yet," not an
            invented one. */}
        <div className="case-study-visit-year">
          <div className="case-study-infobar-item">
            <span className="case-study-infobar-label">
              <T k="work.visit" />
            </span>
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study-infobar-value case-study-infobar-link"
              >
                <T k="work.liveSite" />
              </a>
            ) : (
              <span className="case-study-infobar-value case-study-infobar-value-muted">
                <T k="work.comingSoon" />
              </span>
            )}
          </div>
          <div className="case-study-infobar-item">
            <span className="case-study-infobar-label">
              <T k="work.year" />
            </span>
            <span
              className={`case-study-infobar-value${project.year ? "" : " case-study-infobar-value-muted"}`}
            >
              {project.year ?? "—"}
            </span>
          </div>
        </div>
      </main>
      <div className="scroll-page-footer">
        <StatusBar />
      </div>
    </>
  );
}
