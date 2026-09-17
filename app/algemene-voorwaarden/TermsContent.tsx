"use client";

import { useLang } from "../components/lang-context";
import { TERMS_CONTENT } from "../data/terms-content";
import { STUDIO_HANDLE, CONTACT_EMAIL } from "../data/brand";
import TransitionLink from "../components/TransitionLink";

// Same plain, unanimated presentation as PrivacyContent.tsx (see that
// file's own comment) — reuses every .legal-* class as-is, no new
// styles. Dutch-only for now (see terms-content.ts's own comment on
// why an English machine translation wasn't attempted for a binding
// legal document) — the `en` branch below is a short, honest note
// instead of silently falling back to Dutch text under an "EN" label,
// or a blank page. Swap in TERMS_CONTENT.en once the user supplies a
// real translation; this component already reads from that slot.
export default function TermsContent() {
  const { lang } = useLang();
  const c = lang === "en" ? TERMS_CONTENT.en : TERMS_CONTENT.nl;

  if (!c) {
    return (
      <div className="legal-page-inner">
        <TransitionLink href="/" className="case-study-back" direction="back">
          ← {STUDIO_HANDLE}
        </TransitionLink>
        <div className="legal-content">
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <p className="legal-body">
            Our Terms &amp; Conditions (Algemene Voorwaarden) are currently only available in Dutch — the legally
            governing version, under Dutch law. An English translation isn’t published yet.
          </p>
          <p className="legal-body">
            <TransitionLink href="/algemene-voorwaarden" className="legal-link">
              Bekijk de Nederlandse versie →
            </TransitionLink>
          </p>
          <section>
            <h2 className="legal-section-title">Contact</h2>
            <p className="legal-body">
              Questions about these terms? Email{" "}
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

  return (
    <div className="legal-page-inner">
      <TransitionLink href="/" className="case-study-back" direction="back">
        ← {STUDIO_HANDLE}
      </TransitionLink>
      <div className="legal-content">
        <h1 className="legal-title">Algemene Voorwaarden</h1>
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
            Vragen over deze algemene voorwaarden? Mail{" "}
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
