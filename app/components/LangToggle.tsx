"use client";

import { useLang } from "./lang-context";

// Two real, always-focusable buttons rather than one button whose own
// label is the current state — that shape (like AudioToggle/CrtToggle)
// reads fine for a boolean on/off, but a language switcher showing
// only "EN" leaves it ambiguous whether clicking activates English or
// switches away from it. aria-current (not disabled) on the active
// one: still reachable by keyboard/screen reader, just visually and
// semantically marked as the current choice, matching how a real
// language switcher's active state should announce.
export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className="flag lang-toggle-option"
        aria-current={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <span className="lang-toggle-sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className="flag lang-toggle-option"
        aria-current={lang === "nl"}
        onClick={() => setLang("nl")}
      >
        NL
      </button>
    </div>
  );
}
