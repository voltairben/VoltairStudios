"use client";

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
// flattening the essay into undifferentiated paragraphs.
export default function AboutContent() {
  const { lang } = useLang();
  const c = ABOUT_CONTENT[lang];

  return (
    <>
      {/* Same real back-link affordance /work/[slug] already has at the
          top of a long scrolling page — this page only had a bottom
          "exit" before, which made sense for one short paragraph but
          not for an essay this long. Reuses next-view-transitions' Link
          for a real transition back, same as every other internal nav
          on this site. */}
      <Link href="/" className="about-back">
        ← voltair_studio
      </Link>

      <div className="about-essay" role="region" aria-labelledby="about-essay-title">
        <div className="about-float-header">
          <h1 id="about-essay-title" className="about-float-title">
            about --voltair_studio
          </h1>
        </div>

        <p className="about-kicker">{c.kicker}</p>

        {c.lead.map((p, i) => (
          <p key={i} className="about-paragraph">
            {p}
          </p>
        ))}

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

        <section className="about-section" aria-labelledby="about-philosophy-title">
          <h2 id="about-philosophy-title" className="about-section-title">
            {c.philosophyTitle}
          </h2>
          <p className="about-paragraph">{c.philosophyIntro}</p>
          {c.subsections.map((s) => (
            <div key={s.title} className="about-subsection">
              <h3 className="about-subsection-title">{s.title}</h3>
              <p className="about-paragraph">{s.body}</p>
            </div>
          ))}
        </section>

        <section className="about-section" aria-labelledby="about-outro-title">
          <h2 id="about-outro-title" className="about-section-title">
            {c.outroTitle}
          </h2>
          {c.outroParagraphs.map((p, i) => (
            <p key={i} className="about-paragraph">
              {p}
            </p>
          ))}
          <p className="about-paragraph about-closing">{c.closing}</p>
        </section>

        {/* Reads as a real command rather than a bare "×" — there's no
            box left to hang a dismiss icon off of. Stays untranslated,
            same as every other command token on this site (see
            data/i18n.ts's own header comment) — "exit" reads as a
            command name, not decorative chrome, in either language. */}
        <Link href="/" className="about-float-close">
          exit
        </Link>
      </div>
    </>
  );
}
