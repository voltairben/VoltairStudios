import type { MetadataRoute } from "next";
import { BASE_URL } from "./data/brand";

// Every real MARKETING route on this site is meant to be public/
// indexable — no backend, no account area, nothing to Disallow there
// (see PRODUCT.md's Capabilities and Constraints). /invoice and
// /quote are the one real exception: internal business documents
// (see app/data/invoice.ts), not something a search result should
// ever surface — Disallowed here and never added to sitemap.ts,
// same belt-and-suspenders as their own page-level noindex metadata.
// Points at sitemap.ts below, same pattern the Next.js docs themselves
// show.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/invoice", "/quote"] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
