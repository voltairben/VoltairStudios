// The studio's own handle — identical in every language, same as a
// real terminal command token (see i18n.ts's own header comment on
// that policy). Shared here rather than duplicated as a raw string
// literal across every place it's rendered (chrome wordmark, both
// back links, the About page's own heading, the boot banner) — caught
// on review: the "Capitalize Voltair_Studio site-wide" change had to
// hand-edit the casing separately in 5 places with no compiler/lint
// signal for one missed.
export const STUDIO_HANDLE = "Voltair_Studio";

// Same reasoning as STUDIO_HANDLE above — was hand-duplicated as a raw
// string literal in 5 places (ChromeBar's Contact link, TerminalInput's
// `contact` command, AboutContent, TerminalPane's CTA, the case-study
// CTA), caught in a pre-launch audit alongside the domain itself not
// yet resolving (flagged, not fixed here — that's a real address swap,
// not a refactor). One shared constant means that swap is a 1-line
// fix instead of 5 hand-edits with no compiler signal for a missed one.
export const CONTACT_EMAIL = "contact@voltairstudio.com";

// Same domain as CONTACT_EMAIL above, same flag: confirm this matches
// wherever the site actually ends up deployed before launch (see
// PRODUCT.md's Open Placeholders). Used by robots.ts/sitemap.ts as the
// one place either would need editing if that domain changes.
export const BASE_URL = "https://voltairstudio.com";
