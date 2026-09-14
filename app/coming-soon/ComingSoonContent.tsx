"use client";

import T from "../components/T";
import { CONTACT_EMAIL } from "../data/brand";

// Split from page.tsx (a Server Component, for the metadata export)
// purely so this can call useLang()/<T> for bilingual copy — same
// "extract just the client-needing part" shape T.tsx's own comment
// describes for about/page.tsx and work/[slug]/page.tsx.
export default function ComingSoonContent() {
  return (
    <div className="coming-soon">
      <span className="coming-soon-wordmark">Voltair_Studio</span>
      <div className="coming-soon-boot">
        <p className="coming-soon-boot-line">
          <span aria-hidden="true">&gt; </span>
          <T k="comingSoon.line1" />
        </p>
        <p className="coming-soon-boot-line">
          <span aria-hidden="true">&gt; </span>
          <T k="comingSoon.line2" />
        </p>
        <p className="coming-soon-boot-line">
          <span aria-hidden="true">&gt; </span>
          <T k="comingSoon.line3" />
          <span className="cursor" aria-hidden="true">
            ▌
          </span>
        </p>
      </div>
      <h1 className="coming-soon-heading">
        <T k="comingSoon.heading" />
      </h1>
      <a href={`mailto:${CONTACT_EMAIL}`} className="coming-soon-contact">
        {CONTACT_EMAIL}
      </a>
    </div>
  );
}
