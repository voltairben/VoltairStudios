// Single source of truth for the placeholder project set — ProjectReel,
// ProjectIndex, and /work/[slug] all read from this instead of each
// independently generating a "1..6" count, so the tiles, the index
// list, and the actual link destinations can never drift out of sync.
// No real project data exists yet (PRODUCT.md: nothing gets fabricated
// in its place) — swap this for real projects the same day real case
// studies exist; nothing downstream needs to change shape.

export type Project = {
  slug: string;
  name: string;
};

const PLACEHOLDER_COUNT = 6;

export const PROJECTS: Project[] = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
  slug: `placeholder-${i + 1}`,
  name: `Placeholder ${i + 1}`,
}));

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
