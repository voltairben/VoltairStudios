import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import ChromeBar from "../components/ChromeBar";
import StatusBar from "../components/StatusBar";

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
// elsewhere on the page.
const ABOUT_BODY =
  "Voltair Studio is a small, senior web-dev team building MVP and launch websites for early-stage startup founders — brand-true UI, a production Next.js front-end, live in days.";
const CONTACT_EMAIL = "contact@voltairstudio.com";

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
        <div className="about-float" role="region" aria-labelledby="about-float-title">
          <div className="about-float-header">
            <h1 id="about-float-title" className="about-float-title">
              about --voltair_studio
            </h1>
          </div>
          <p className="about-float-body">{ABOUT_BODY}</p>
          <div className="about-float-meta">
            <div className="about-float-meta-row">
              <span className="about-float-meta-label">status</span>
              <span className="about-float-meta-value">Available October 2026</span>
            </div>
            <div className="about-float-meta-row">
              <span className="about-float-meta-label">contact</span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="about-float-meta-link">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
          {/* Reads as a real command rather than a bare "×" — there's
              no box left to hang a dismiss icon off of. Direct request
              dropped the $ prefix this originally had (site-wide, not
              just here — see DESIGN.md); "exit" alone still reads as
              a command name, not decorative chrome. next-view-transitions'
              Link, so this still gets a real view transition back. */}
          <Link href="/" className="about-float-close">
            exit
          </Link>
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
