// The studio's own handle — identical in every language, same as a
// real terminal command token (see i18n.ts's own header comment on
// that policy). Shared here rather than duplicated as a raw string
// literal across every place it's rendered (chrome wordmark, both
// back links, the About page's own heading, the boot banner) — caught
// on review: the "Capitalize Voltair_Studio site-wide" change had to
// hand-edit the casing separately in 5 places with no compiler/lint
// signal for one missed.
export const STUDIO_HANDLE = "Voltair_Studio";
