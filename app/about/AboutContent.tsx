"use client";

import { Link } from "next-view-transitions";
import { useLang } from "../components/lang-context";
import { t } from "../data/i18n";
import { ABOUT_CONTENT } from "../data/about-content";

const CONTACT_EMAIL = "contact@voltairstudio.com";

// Full rebuild, direct request, modeled on a reference screenshot
// (segerman.dev's own About page): a big corner headline instead of a
// page-filling essay, a short user-authored bio instead of the earlier
// "This Is Voltair" essay (see data/about-content.ts — the user judged
// that one "too long and too difficult to space out properly" and
// shortened it himself), and a small Tools/meta cluster instead of the
// old 3-column editorial spread this replaces wholesale (that
// history — the essay, the 3-column grid, the subgrid row-alignment
// work — lives in globals.css's own comment on .about-page for
// context, not because any of it carries forward here).
//
// Layout mirrors the reference horizontally, not literally: the
// reference puts its bio bottom-left: direct request puts this one
// bottom-right instead, so Tools/status/contact balance the page on
// the left. The reference's own photo and Awards list have no real
// counterpart here (no headshot on hand, no awards to claim — DESIGN.md's
// own principle against fabricating proof) and aren't invented to fill
// the reference's exact shape.
export default function AboutContent() {
  const { lang } = useLang();
  const c = ABOUT_CONTENT[lang];

  return (
    <div className="about-page-wrap" role="region" aria-labelledby="about-heading">
      <div className="about-masthead">
        <Link href="/" className="about-back">
          ← voltair_studio
        </Link>
      </div>

      {/* Big corner headline, direct request: "the same capital about
          ... same design and look as Creative Designers has on the
          home page" — reuses that exact headline token (--fs-headline)
          and weight, uppercased via CSS (the source string stays
          normal-case for screen readers) rather than baking caps into
          the translated copy itself. */}
      <h1 id="about-heading" className="about-hero-heading">
        {t(lang, "about.heading")}
      </h1>

      {/* Pushed to the bottom of the remaining space (margin-top:auto,
          see globals.css) — the empty middle is where the floating 3D
          logo (SkyboxCanvas.tsx) already shows through, same as it did
          behind the old 3-column essay. */}
      <div className="about-bottom-row">
        <div className="about-meta-cluster">
          <div className="about-meta-block">
            <h2 className="about-meta-heading">{t(lang, "about.tools")}</h2>
            <p className="about-tools-list">{c.tools.join(", ")}</p>
          </div>
          <div className="about-meta-block">
            <div className="about-float-meta-row">
              <span className="about-float-meta-label">{t(lang, "about.status")}</span>
              <span className="about-float-meta-value">{t(lang, "status.available")}</span>
            </div>
            <div className="about-float-meta-row">
              <span className="about-float-meta-label">{t(lang, "about.contact")}</span>
              <a href={`mailto:${CONTACT_EMAIL}`} className="about-float-meta-link">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom-right, direct request. No separate "exit" link here
            (the old 3-column layout's own — see its removal in this
            same change) — the masthead's "← voltair_studio" above is
            already the one real way back, and a second one reads as
            clutter now that this page is this short. */}
        <div className="about-bio">
          {c.bio.map((p, i) => (
            <p key={i} className="about-bio-paragraph">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
