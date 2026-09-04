"use client";

import { Link } from "next-view-transitions";
import { useLang } from "../components/lang-context";
import { t } from "../data/i18n";
import { ABOUT_CONTENT } from "../data/about-content";
import ScrambleText from "../components/ScrambleText";

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
// Layout now matches the reference's own left/right split directly,
// direct follow-up: bio on the left, Tools/status/contact on the
// right (an earlier round had these mirrored — bio right, meta left —
// per an even earlier direct request; this reverses that once the
// user saw it live). The reference's own photo and Awards list have
// no real counterpart here (no headshot on hand, no awards to claim —
// DESIGN.md's own principle against fabricating proof) and aren't
// invented to fill the reference's exact shape.
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
          the translated copy itself. ScrambleText, direct follow-up
          ("the changing of the text") — the same scramble/decode
          mount reveal (and hover re-scramble) TerminalPane.tsx already
          gives "Creative"/"Designers"; matches "same ... the changing
          of the text" literally rather than just the static size/color
          the first pass matched. */}
      <h1 id="about-heading" className="about-hero-heading">
        <ScrambleText text={t(lang, "about.heading")} />
        {/* Blinking cursor block, direct request ("I want this also
            behind the about") — the same one .headline gives
            "Designers" (see globals.css's own .cursor comment for why
            it cancels the inherited halo: a solid glyph this size
            reads as a dark box under it, not a legibility ring). */}
        <span className="cursor" aria-hidden="true">
          ▌
        </span>
      </h1>

      {/* Pushed to the bottom of the remaining space (margin-top:auto,
          see globals.css) — the empty middle is where the floating 3D
          logo (SkyboxCanvas.tsx) already shows through, same as it did
          behind the old 3-column essay. */}
      <div className="about-bottom-row">
        {/* Left, direct request — no separate "exit" link here (the
            old 3-column layout's own — see its removal in this same
            change) — the masthead's "← voltair_studio" above is
            already the one real way back, and a second one reads as
            clutter now that this page is this short. */}
        <div className="about-bio">
          {/* Direct request: "About --voltair_studio" / "This Is
              Voltair, by Bennie" above the bio text — the old H1 +
              kicker pair from before the ABOUT/scramble headline took
              over that role, now reintroduced as a smaller title/
              byline heading the bio column, not a page-wide hero.
              "About --voltair_studio" stays untranslated, plain text —
              same handle the masthead's own back link and chrome
              wordmark already show in every language, not prose. */}
          <div className="about-bio-heading">
            <h2 className="about-bio-title">About --voltair_studio</h2>
            <p className="about-bio-kicker">{c.kicker}</p>
          </div>
          {c.bio.map((p, i) => (
            <p key={i} className="about-bio-paragraph">
              {p}
            </p>
          ))}
        </div>

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
      </div>
    </div>
  );
}
