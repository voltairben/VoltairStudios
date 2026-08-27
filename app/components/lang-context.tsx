"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { type Lang, isLang, LANG_STORAGE_KEY } from "../data/i18n";

// Same minimal Context pattern crt-context.tsx / audio-context.tsx
// already established: a fixed SSR-safe default ("en", matching
// layout.tsx's own static <html lang="en">), corrected once from
// localStorage after mount, so there's no server/client text mismatch
// on first paint — a visitor's saved language only ever takes effect
// after hydration, exactly like the CRT/audio toggles already do.
type LangContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
};

const Ctx = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && isLang(saved)) setLangState(saved);
    } catch {
      // localStorage blocked — default stands
    }
  }, []);

  // Keeps the real lang attribute in sync — the same "theme any
  // browser-default surface" instinct globals.css's ::selection rule
  // already follows (see DESIGN.md), and a real a11y/SEO signal, not
  // just decoration: screen readers use document.lang to pick the
  // right pronunciation/voice.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // not persisted this session, but the in-memory swap still works
    }
  }, []);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
