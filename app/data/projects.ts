// Single source of truth for the project set — ProjectReel, ProjectIndex,
// and /work/[slug] all read from this instead of each independently
// generating a project list, so the tiles, the index list, and the
// actual link destinations can never drift out of sync.

export type Project = {
  slug: string;
  name: string;
  /** Live site link — when present, the case-study page shows it in
   *  place of the generic "in progress" placeholder text. Optional:
   *  most slots are still placeholders (PRODUCT.md — nothing fabricated
   *  in their place) until real projects exist for them. */
  url?: string;
  /** Real screenshots of the live site's actual sections/pages — never
   *  stock or invented imagery, and never a fabricated "Dashboard" or
   *  "Settings" screen for a site that has no such thing (see
   *  DESIGN.md). `label` is that real section's own real name. Absent
   *  for every placeholder slot; the viewer shows a clearly-labeled
   *  empty state instead. */
  mockups?: { label: string; src: string }[];
  /** Real thumbnail for this project's tile in ProjectReel/ProjectIndex —
   *  a different slot from `mockups` above, which is the case-study
   *  page's own carousel. Absent for every placeholder slot; the tile
   *  shows the diagonal "content goes here" glass pattern instead (see
   *  PRODUCT.md — nothing fabricated in its place). */
  image?: string;
  year?: string;
  role?: string;
  description?: string;
};

const PLACEHOLDER_COUNT = 6;

export const PROJECTS: Project[] = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
  slug: `placeholder-${i + 1}`,
  name: `Placeholder ${i + 1}`,
}));

// First real project — direct request, replaces slot 1.
PROJECTS[0] = {
  slug: "krachtig-fit",
  name: "KrachtigFit",
  url: "https://krachtig-fit-two.vercel.app/",
  // Reel/index tile thumbnail — a real photo of Sander (the trainer),
  // not a site screenshot. Direct request: goes on the tile itself,
  // not in the case-study mockups carousel below.
  image: "/photos/krachtig-fit-sander.jpg",
  // 5 real screenshots of the live site's own real sections/pages —
  // captured directly, not invented. KrachtigFit is a single-page
  // coaching site (checked its real nav/routes directly, no SaaS
  // dashboard exists), so these are real anchors + one real route
  // (/kennismaking) instead of the generic "Dashboard/Settings/
  // Pricing" a request asked for — see DESIGN.md. Curated by actually
  // reviewing the whole page (a full scroll-through, not just following
  // nav anchors mechanically) and picking the 5 that read best, in a
  // deliberate order: intro, who's behind it, proof, what you get, how
  // to start.
  mockups: [
    { label: "Home", src: "/mockups/krachtig-fit.png" },
    { label: "Over mij", src: "/mockups/krachtig-fit-about.png" },
    { label: "Klanten resultaten", src: "/mockups/krachtig-fit-results.png" },
    { label: "Programma's", src: "/mockups/krachtig-fit-programs.png" },
    { label: "Kennismaking", src: "/mockups/krachtig-fit-kennismaking.png" },
  ],
  // Direct request — the first real value provided for this field.
  // role/description still intentionally left unset: not fabricating
  // metadata that hasn't actually been provided.
  year: "2026",
};

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
