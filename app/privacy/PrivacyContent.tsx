"use client";

import { useLang } from "../components/lang-context";
import { LEGAL_CONTENT } from "../data/legal-content";
import { STUDIO_HANDLE, CONTACT_EMAIL } from "../data/brand";
import TransitionLink from "../components/TransitionLink";

// Plain, readable — no ScrambleText/kinetic effects here. Every other
// piece of motion on this site is a deliberate flourish on marketing
// copy; a legal document is exactly the content that shouldn't compete
// with its own presentation. Shares .case-study-back's exact look (see
// globals.css) for the same "← Voltair_Studio" return link every other
// non-home page already has — no new back-link style invented for a
// third page.
export default function PrivacyContent() {
  const { lang } = useLang();
  const c = LEGAL_CONTENT[lang];

  return (
    <div className="legal-page-inner">
      <TransitionLink href="/" className="case-study-back" direction="back">
        ← {STUDIO_HANDLE}
      </TransitionLink>
      <div className="legal-content">
        <h1 className="legal-title">{lang === "nl" ? "Privacybeleid" : "Privacy Policy"}</h1>
        <p className="legal-updated">{c.updated}</p>
        {c.intro.map((p, i) => (
          <p key={i} className="legal-body">
            {p}
          </p>
        ))}
        {c.sections.map((section) => (
          <section key={section.title}>
            <h2 className="legal-section-title">{section.title}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="legal-body">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="legal-list">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section>
          <h2 className="legal-section-title">{lang === "nl" ? "Contact" : "Contact"}</h2>
          <p className="legal-body">
            {lang === "nl" ? "Vragen over dit beleid, of over je gegevens? Mail " : "Questions about this policy, or about your data? Email "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="legal-link">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
