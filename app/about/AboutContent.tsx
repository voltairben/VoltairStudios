"use client";

import { Link } from "next-view-transitions";
import { useLang } from "../components/lang-context";
import { t } from "../data/i18n";

const CONTACT_EMAIL = "contact@voltairstudio.com";

// Split out of page.tsx (a Server Component — it keeps `export const
// metadata`, which Next.js only allows outside "use client" files) so
// the translated body can call useLang() directly. See T.tsx's own
// comment for why some spots use that generic wrapper instead — this
// one has enough real content (a whole paragraph, several labels) that
// a dedicated component reads better than four separate <T> drops.
export default function AboutContent() {
  const { lang } = useLang();
  return (
    <div className="about-float" role="region" aria-labelledby="about-float-title">
      <div className="about-float-header">
        <h1 id="about-float-title" className="about-float-title">
          about --voltair_studio
        </h1>
      </div>
      <p className="about-float-body">{t(lang, "about.body")}</p>
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
      {/* "exit" stays a literal command token, same policy as the
          terminal's own command names (help/about/contact/...) — not
          translated, matching how a real shell's commands don't
          change with the OS's display language. */}
      <Link href="/" className="about-float-close">
        exit
      </Link>
    </div>
  );
}
