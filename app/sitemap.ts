import type { MetadataRoute } from "next";
import { BASE_URL } from "./data/brand";
import { PROJECTS } from "./data/projects";

// Built off PROJECTS (the same single source of truth ProjectReel/
// ProjectIndex/[slug]/page.tsx already read from) instead of a
// hand-maintained URL list — every real prerendered route this site
// has, and it can't drift out of sync with what generateStaticParams
// actually builds. Placeholder slugs are still real, reachable pages
// (see the pre-launch audit note in projects.ts), so they're listed
// too, just at a lower priority than the real case studies.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...PROJECTS.map((p) => ({
      url: `${BASE_URL}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.url ? 0.6 : 0.3,
    })),
  ];
}
