"use client";

import { useLang } from "./lang-context";

// For per-project content that lives in data/projects.ts, not the
// shared UI-string dictionary (data/i18n.ts + <T k="..."/>) — a case
// study's own description is that project's content, not site chrome
// reused across every page, so it doesn't belong in the same shared
// dictionary those strings live in. Same "pick the current language"
// job as <T>, just fed inline text instead of a fixed dictionary key.
export default function Localized({ en, nl }: { en: string; nl: string }) {
  const { lang } = useLang();
  return lang === "nl" ? nl : en;
}
