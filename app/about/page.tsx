import type { Metadata } from "next";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";
import AboutContent from "./AboutContent";

export const metadata: Metadata = { title: "About — Voltair Studio" };

// Real, already-shipped copy only — reused verbatim from layout.tsx's
// <meta description> and StatusBar's own availability line. PRODUCT.md
// is explicit ("No copy, testimonials, or case studies exist — none
// will be invented") and its one Positioning statement is itself
// flagged "[Assumption, flagged for confirmation]", not fact — so a
// "developer bio / skills / philosophy" page isn't written from
// scratch here. This is the honest subset: the one paragraph of studio
// positioning that's already public (search snippets, OG previews),
// plus the two real status facts ChromeBar/StatusBar already show
// elsewhere on the page. The EN copy lives in data/i18n.ts now (see
// AboutContent.tsx) alongside its NL translation, not inline here.

// A real route (see DESIGN.md for the modal-to-route history). Reuses
// .page as-is for the outer shell — same zero-scroll 3-row grid
// ("screen-locked") the homepage already uses, with ChromeBar/StatusBar
// landing in the exact same top/bottom position via the same grid-row
// rules, no new positioning scheme needed. .skybox-canvas lives in the
// root layout (position: fixed, pointer-events: none — see layout.tsx),
// so it's already rendering behind this route with zero extra wiring.
//
// Floating text, not a boxed panel — direct request: dropped the
// "Terminal Glass" box (fill/blur/border) this shipped with initially
// in favor of the exact technique .content already uses on the
// homepage — text sitting directly on the open sky, legible via
// --text-halo per glyph instead of a panel behind it. See globals.css.
export default function AboutPage() {
  return (
    <div className="page">
      <ChromeBar />
      <main className="about-page-content">
        {/* Reads as a real command rather than a bare "×" — there's no
            box left to hang a dismiss icon off of. Direct request
            dropped the $ prefix this originally had (site-wide, not
            just here — see DESIGN.md); "exit" alone still reads as a
            command name, not decorative chrome — and stays untranslated
            for the same reason (see AboutContent.tsx). */}
        <AboutContent />
      </main>
      <StatusBar />
    </div>
  );
}
