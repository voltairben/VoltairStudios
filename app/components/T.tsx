"use client";

import { useLang } from "./lang-context";
import { t, type TKey } from "../data/i18n";

// Drop-in translated text for spots that are Server Components
// (about/page.tsx, work/[slug]/page.tsx — both keep generateMetadata,
// which requires staying server-rendered) and so can't call useLang()
// directly. A Client Component works fine as a child of a Server
// Component in the App Router, so this is the smallest way to get
// per-string translation into that JSX without converting either page
// wholesale — same "extract just the client-needing part" shape
// EstrelaCardViewer already uses for the mockup carousel on the same
// page.
export default function T({ k }: { k: TKey }) {
  const { lang } = useLang();
  return t(lang, k);
}
