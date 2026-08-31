// Single source of truth for the EN/NL toggle (ChromeBar's <LangToggle>)
// and every translated string it drives — same "one shared file, not
// two components each keeping their own copy" reasoning as palette.ts
// and projects.ts already use in this codebase.
//
// Scope, decided once here rather than per-string: real terminal
// COMMAND TOKENS (help, about, contact, theme cobalt, --crt=on, ...)
// are never translated — exactly like a real shell, where `cd`/`ls`
// stay the same regardless of the OS's display language. Only prose
// AROUND the terminal (boot lines, log framing, page copy) is
// bilingual. Technical field names in `systeminfo`'s own table
// (uptime, viewport, dpr, engine, skybox, canvas) stay English too,
// matching how real diagnostic tools keep field names stable across
// locales — only the on/off VALUES in that table translate.
export const LANGS = ["en", "nl"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export const LANG_STORAGE_KEY = "voltair-lang";

const DICT = {
  "nav.about": { en: "About", nl: "Over ons" },
  "nav.contact": { en: "Contact", nl: "Contact" },
  "nav.contactCopied": { en: "Email copied!", nl: "E-mail gekopieerd!" },
  "nav.langToggle": { en: "Switch to Dutch", nl: "Switch to English" },

  "status.available": {
    en: "Available October 2026",
    nl: "Beschikbaar vanaf oktober 2026",
  },

  "hero.headline1": { en: "Creative", nl: "Creatieve" },
  "hero.headline2": { en: "Designers", nl: "Ontwerpers" },
  "hero.tagline": {
    en: "Engineering the Architecture Behind the Aesthetics.",
    // Direct request: was "De architectuur achter de esthetiek —
    // geëngineerd." — the dash split the sentence into a fragment,
    // not idiomatic Dutch. One continuous clause instead, same
    // meaning as the EN gerund-led original.
    nl: "De geëngineerde architectuur achter de esthetiek.",
  },

  // "about.body" removed — the About page's short placeholder paragraph
  // was replaced wholesale by the real "This Is Voltair" essay (see
  // data/about-content.ts), which is structured content, not a single
  // shared UI string, so it doesn't live in this dictionary either.
  "about.status": { en: "status", nl: "status" },
  "about.contact": { en: "contact", nl: "contact" },

  "work.inProgress": {
    en: "Case study in progress — check back soon.",
    nl: "Case study in ontwikkeling — kom snel terug.",
  },
  "work.role": { en: "Role", nl: "Rol" },
  "work.nextProject": { en: "Next Project", nl: "Volgend Project" },
  "work.visit": { en: "Visit", nl: "Bezoek" },
  "work.year": { en: "Year", nl: "Jaar" },
  "work.liveSite": { en: "Live site ↗", nl: "Live website ↗" },
  "work.comingSoon": { en: "Coming soon", nl: "Binnenkort" },

  "terminal.bootReady": { en: "ready", nl: "gereed" },
  "terminal.commandsLabel": { en: "commands", nl: "commando's" },
  "terminal.typeHelp": {
    en: "type 'help' to begin",
    nl: "typ 'help' om te beginnen",
  },
  "terminal.soundOn": { en: "→ sound: on", nl: "→ geluid: aan" },
  "terminal.soundOff": { en: "→ sound: off", nl: "→ geluid: uit" },
  "terminal.crtOn": { en: "→ crt: on", nl: "→ crt: aan" },
  "terminal.crtOff": { en: "→ crt: off", nl: "→ crt: uit" },
  "terminal.paletteLabel": { en: "palette", nl: "palet" },
  "terminal.invalidPalette": { en: "invalid palette. try:", nl: "ongeldig palet. probeer:" },
  "terminal.projectsLabel": { en: "projects", nl: "projecten" },
  "terminal.projectNotFound": {
    en: "no project found for:",
    nl: "geen project gevonden voor:",
  },
  "terminal.contactCopied": {
    en: "copied — opening mail client",
    nl: "gekopieerd — mailclient wordt geopend",
  },
  "terminal.commandNotFound": { en: "command not found:", nl: "commando niet gevonden:" },
  "terminal.tryHelp": { en: "try 'help'", nl: "probeer 'help'" },
  "terminal.on": { en: "on", nl: "aan" },
  "terminal.off": { en: "off", nl: "uit" },
} as const;

export type TKey = keyof typeof DICT;

export function t(lang: Lang, key: TKey): string {
  return DICT[key][lang];
}
