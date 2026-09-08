import type { MetadataRoute } from "next";
import { BASE_URL } from "./data/brand";

// Every real route on this site is meant to be public/indexable — no
// backend, no account area, nothing to Disallow (see PRODUCT.md's
// Capabilities and Constraints). Points at sitemap.ts below, same
// pattern the Next.js docs themselves show.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
