"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import logo from "../../Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png";
import LangToggle from "./LangToggle";
import { useLang } from "./lang-context";
import { t } from "../data/i18n";

const CONTACT_EMAIL = "contact@voltairstudio.com";
const COPIED_MS = 1800; // how long "Email copied!" stays before reverting

export default function ChromeBar() {
  const [copied, setCopied] = useState(false);
  const { lang } = useLang();

  // Copy-to-clipboard is a courtesy alongside the real mailto link, not
  // instead of it — e.preventDefault() is never called, so the mail
  // client still opens normally even if clipboard access is denied
  // (permissions, non-secure context, etc.) or the browser lacks the
  // API entirely.
  const handleClick = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(CONTACT_EMAIL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPIED_MS);
      })
      .catch(() => {
        // permission denied — mailto: navigation still fires on its own
      });
  };

  return (
    <header className="chrome-bar">
      {/* Real navigation now, not a static label — direct request. Plain
          next-view-transitions Link, same className the div had, so
          .wordmark's own layout/position is completely unaffected (a
          flex item's outer display value doesn't matter to a flex
          parent — div and a both get blockified the same way). No
          custom role/tabIndex/keydown anywhere in this file: a real
          <a href> is natively focusable and already activates on
          Enter for free; Space intentionally still scrolls instead of
          navigating, which is correct native link behavior, not a gap
          to patch — hijacking it would fight what a link is actually
          supposed to do on Space. */}
      <Link href="/" className="wordmark">
        Voltair_Studio
      </Link>
      <nav className="chrome-nav" aria-label="Site">
        {/* Same real-link treatment as the wordmark above — direct
            request named "the logo and the top-left brand name" as a
            pair, but the logo lives here in the nav cluster, not
            top-left next to the wordmark (moved here by an earlier
            direct request — see the comment below); preserved that
            actual layout rather than moving it back to match the
            request's own inaccurate premise, since "preserve the exact
            layout coordinates" was explicit in the same request. The
            inner span drops role="img"/aria-label now that the Link
            around it carries the one real accessible name for this
            control — a nested img role would just double-announce
            "Voltair Studio" on top of the link's own name. */}
        <Link href="/" className="chrome-logo-link" aria-label="Voltair Studio">
          {/* Recolored to the accent via CSS mask, not rendered as an
              <img> — the logo's real green stays only in the source
              file and the favicon; on-page it now matches "Contact",
              by direct request. */}
          <span
            className="chrome-logo"
            aria-hidden="true"
            style={{
              WebkitMaskImage: `url(${logo.src})`,
              maskImage: `url(${logo.src})`,
            }}
          />
        </Link>
        {/* Between the logo and About, per direct request — a small
            EN/NL group, not a heavy locale-routing setup: this is a
            two-language marketing page, not a multi-region product,
            so a persisted client-side toggle (LangProvider, same
            localStorage-restore shape as the CRT/audio toggles) is
            the real, matched-to-scope solution; see lang-context.tsx
            and data/i18n.ts. */}
        <LangToggle />
        {/* A real route now (/about), not a local modal-open button —
            direct request, replacing an in-page overlay this same
            session had already built and verified (see DESIGN.md).
            next-view-transitions' Link, so navigating here (either
            direction) gets a real browser view transition for free. */}
        <Link href="/about" className="chrome-nav-link">
          {t(lang, "nav.about")}
        </Link>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="chrome-nav-link"
          onClick={handleClick}
          aria-live="polite"
        >
          {copied ? t(lang, "nav.contactCopied") : t(lang, "nav.contact")}
        </a>
      </nav>
    </header>
  );
}
