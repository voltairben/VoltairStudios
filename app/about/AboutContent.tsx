"use client";

import { Fragment } from "react";
import { Link } from "next-view-transitions";
import { useLang } from "../components/lang-context";
import { t } from "../data/i18n";
import { ABOUT_CONTENT } from "../data/about-content";

const CONTACT_EMAIL = "contact@voltairstudio.com";

// Split out of page.tsx (a Server Component — it keeps `export const
// metadata`, which Next.js only allows outside "use client" files) so
// the translated body can call useLang() directly. Rewritten for the
// real "This Is Voltair" essay (see data/about-content.ts) — direct
// request to replace the old one-paragraph placeholder wholesale, "in
// the style" of this system with "each head piece... in the correct
// colour": every real heading level gets its own place in the
// established amber-bright-for-headings hierarchy (.about-section-title
// bigger/bolder than .about-subsection-title, project names styled as
// real links since they go to real case studies) rather than
// flattening the essay into undifferentiated paragraphs. Laid out as a
// real editorial 3-column spread (.about-grid), not one narrow
// centered column, per a later direct request to fit the whole essay
// in one fixed viewport again — see globals.css's own comment on
// .about-page for that layout's full history.
export default function AboutContent() {
  const { lang } = useLang();
  const c = ABOUT_CONTENT[lang];

  return (
    <div className="about-page-wrap" role="region" aria-labelledby="about-essay-title">
      <div className="about-masthead">
        {/* Was position:fixed (useful while this page still scrolled,
            so the back link stayed reachable at any scroll position) —
            now that the page is a fixed single viewport again, that's
            no longer needed, and fixed positioning at a hardcoded top
            offset was exactly what silently broke: tightening
            .about-page's own top padding in this same round moved the
            masthead up without moving this in step, so the two
            overlapped (caught live, not assumed — a real screenshot
            showed the actual overlap, not a hypothetical). Inline in
            the masthead's own flex row, it can't drift out of sync
            again regardless of future padding changes. Just the back
            link now — the H1/kicker moved into the left column below,
            direct request, so they sit at the same height as the other
            two columns' own real headings instead of in a separate row
            above the whole grid. */}
        <Link href="/" className="about-back">
          ← voltair_studio
        </Link>
      </div>

      {/* Editorial 3-column spread: real content fits one viewport by
          using the page's full width instead of one narrow centered
          column — each column is a real, coherent block (not raw
          multi-column text reflow, which would split paragraphs and
          headings unpredictably mid-thought), matching how a real
          magazine spread groups whole sections side by side rather
          than free-flowing character-by-character. */}
      {/* Explicit grid-row on every item below, direct request: "About
          --voltair_studio" on My Philosophy's line, the first lead
          paragraph on the intro's line, "I don't do standard" on "I
          lock my designs"'s line, "I build digital playrooms" on "By
          using smooth animations"'s line, and so on. Column 2's own h3
          subsection titles don't have a column-1/3 counterpart, so each
          gets a row to itself between the body paragraphs that do —
          see the row map in globals.css's .about-grid comment. Lead
          paragraphs and outro paragraphs both land on row 2+i*2 so
          index i always shares a line whether it's column 1 or 3. */}
      <div className="about-grid">
        <div className="about-col">
          {/* The page's own H1 + byline, direct request moved here
              from the separate masthead row above — column 1 had no
              heading of its own before, unlike columns 2/3's real
              section titles, so this doubles as that column's own
              heading. Wrapped with the kicker into .about-heading-block
              (see globals.css) so the pair counts as one row-1 item in
              the 3-column subgrid and lines up with "My Philosophy" /
              "The Human Outro" on the same line, direct request. Kicker
              now sits inline behind the H1 (same line), not stacked
              below it — also a direct request. */}
          <div className="about-heading-block" style={{ gridRow: 1 }}>
            <h1 id="about-essay-title" className="about-float-title">
              About --voltair_studio
            </h1>
            <p className="about-kicker">{c.kicker}</p>
          </div>
          {c.lead.map((p, i) => (
            <p key={i} className="about-paragraph" style={{ gridRow: 2 + i * 2 }}>
              {p}
            </p>
          ))}
        </div>

        <div className="about-col">
          <h2 className="about-section-title" style={{ gridRow: 1 }}>
            {c.philosophyTitle}
          </h2>
          <p className="about-paragraph" style={{ gridRow: 2 }}>
            {c.philosophyIntro}
          </p>
          {c.subsections.map((s, i) => (
            <Fragment key={s.title}>
              <h3 className="about-subsection-title" style={{ gridRow: 3 + i * 2 }}>
                {s.title}
              </h3>
              <p className="about-paragraph" style={{ gridRow: 4 + i * 2 }}>
                {s.body}
              </p>
            </Fragment>
          ))}
        </div>

        <div className="about-col">
          <h2 className="about-section-title" style={{ gridRow: 1 }}>
            {c.outroTitle}
          </h2>
          {c.outroParagraphs.map((p, i) => (
            <p key={i} className="about-paragraph" style={{ gridRow: 2 + i * 2 }}>
              {p}
            </p>
          ))}
          <p className="about-paragraph about-closing" style={{ gridRow: 8 }}>
            {c.closing}
          </p>
          {/* Reads as a real command rather than a bare "×" — there's
              no box left to hang a dismiss icon off of. Stays
              untranslated, same as every other command token on this
              site (see data/i18n.ts's own header comment). */}
          <Link href="/" className="about-float-close" style={{ gridRow: 9 }}>
            exit
          </Link>
        </div>
      </div>

      {/* Status/contact, direct request moved out of column 1 and down
          here so it sits dead-center at the bottom of the page instead
          of trailing off under the lead paragraphs — a sibling of
          .about-grid, not one of its cells, so it's free of the row
          grid above and .about-page-wrap's own flex centers it. */}
      <div className="about-float-meta">
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
  );
}
