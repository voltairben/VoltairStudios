import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "../../data/projects";

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
// this is that, for us). No real project work exists yet (PRODUCT.md: no
// fabricated case studies), so this is an honest "in progress" page, not
// invented client work — same non-fabrication stance as the placeholder
// tiles that link here. Deliberately outside .page's zero-scroll layout:
// a real case study is exactly the kind of content a normal scrolling
// page suits, not a single fixed viewport.
export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="case-study">
      {/* Hash carries which project this was so ProjectReel (a fresh
          mount on "/") knows which of its 6 duplicated copies to tag
          with the matching view-transition-name for the reverse morph —
          see ProjectReel.tsx's hash-read effect. */}
      <Link href={`/#${project.slug}`} className="case-study-back">
        ← voltair_studio
      </Link>
      <h1
        className="case-study-title"
        style={{ viewTransitionName: `project-title-${project.slug}` }}
      >
        {project.name}
      </h1>
      <p className="case-study-body">
        Case study in progress — check back soon.
      </p>
      <a href="mailto:contact@voltairstudio.com" className="case-study-cta">
        contact@voltairstudio.com
      </a>
    </main>
  );
}
