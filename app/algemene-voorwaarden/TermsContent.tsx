"use client";

import { useLang } from "../components/lang-context";
import { TERMS_CONTENT } from "../data/terms-content";
import { STUDIO_HANDLE, CONTACT_EMAIL } from "../data/brand";
import TransitionLink from "../components/TransitionLink";

// Same plain, unanimated presentation as PrivacyContent.tsx (see that
// file's own comment) — reuses every .legal-* class as-is, no new
// styles. Both languages are now real content the user supplied
// himself (see terms-content.ts's own comment) — same single-path
// render PrivacyContent.tsx uses, no per-language branching needed.
export default function TermsContent() {
  const { lang } = useLang();
  const c = TERMS_CONTENT[lang];

  return (
    <div className="legal-page-inner">
      <TransitionLink href="/" className="case-study-back" direction="back">
        ← {STUDIO_HANDLE}
      </TransitionLink>
      <div className="legal-content">
        <h1 className="legal-title">{lang === "nl" ? "Algemene Voorwaarden" : "General Terms and Conditions"}</h1>
        {c.letterhead.map((line, i) => (
          <p key={i} className="legal-body">
            {line}
          </p>
        ))}
        <p className="legal-updated">{c.updated}</p>
        {c.sections.map((section) => (
          <section key={section.title}>
            <h2 className="legal-section-title">{section.title}</h2>
            {section.clauses.map((clause, i) => (
              <div key={i}>
                <p className="legal-body">{clause.text}</p>
                {clause.subItems && (
                  <ul className="legal-list">
                    {clause.subItems.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
        <section>
          <h2 className="legal-section-title">Contact</h2>
          <p className="legal-body">
            {lang === "nl" ? "Vragen over deze algemene voorwaarden? Mail " : "Questions about these terms? Email "}
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
