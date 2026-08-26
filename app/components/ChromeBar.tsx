"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";
import logo from "../../Logo/3e3c5a99-524a-4fd8-88be-d24715bbdcf5.png";

const CONTACT_EMAIL = "contact@voltairstudio.com";
const COPIED_MS = 1800; // how long "Email copied!" stays before reverting

export default function ChromeBar() {
  const [copied, setCopied] = useState(false);

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
      <div className="wordmark">voltair_studio</div>
      <nav className="chrome-nav" aria-label="Site">
        {/* Recolored to the accent via CSS mask, not rendered as an <img> —
            the logo's real green stays only in the source file and the
            favicon; on-page it now matches "Contact", by direct request. */}
        <span
          className="chrome-logo"
          role="img"
          aria-label="Voltair Studio"
          style={{
            WebkitMaskImage: `url(${logo.src})`,
            maskImage: `url(${logo.src})`,
          }}
        />
        {/* A real route now (/about), not a local modal-open button —
            direct request, replacing an in-page overlay this same
            session had already built and verified (see DESIGN.md).
            next-view-transitions' Link, so navigating here (either
            direction) gets a real browser view transition for free. */}
        <Link href="/about" className="chrome-nav-link">
          About
        </Link>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="chrome-nav-link"
          onClick={handleClick}
          aria-live="polite"
        >
          {copied ? "Email copied!" : "Contact"}
        </a>
      </nav>
    </header>
  );
}
