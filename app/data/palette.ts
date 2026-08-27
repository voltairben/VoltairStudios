// Single source of truth for `theme <name>` (TerminalInput.tsx) and its
// restore-on-load counterpart (PaletteRestorer.tsx) — same reasoning as
// projects.ts: two places reading their own separately-maintained copy
// of this list is exactly how they'd quietly drift apart. Not a React
// context: nothing needs to reactively re-render when the palette
// changes (it's a plain DOM attribute the CSS reads directly), so
// there's no state to share, just these constants/helpers.
export const PALETTES = [
  "persimmon",
  "cobalt", // was "green" — direct request to recolor it blue. Renamed,
  // not just recolored: a command called `green` making things blue
  // would be its own small trap. "Electric Cobalt" was one of this
  // project's own real candidate accents considered before persimmon
  // won (see DESIGN.md's palette v3 history) — a real name from this
  // project's own past, not invented for this rename.
  "amber",
  "ambergris", // real alias of amber, not a second theme — see
  // globals.css's :root[data-palette="amber"] comment
  "turbo-blue",
  "phosphor-decay",
  "stealth-obsidian",
  "vapor-comm",
] as const;
export type PaletteName = (typeof PALETTES)[number];

export function isPaletteName(value: string): value is PaletteName {
  return (PALETTES as readonly string[]).includes(value);
}

// The CSS override block a given name actually applies — only
// "ambergris" resolves to something other than itself.
export function resolvePaletteAttr(name: PaletteName): Exclude<PaletteName, "ambergris"> {
  return name === "ambergris" ? "amber" : name;
}

export const PALETTE_STORAGE_KEY = "voltair-palette";

// Swatch preview colors for the fold-out picker (TerminalInput.tsx) —
// intentionally duplicates the real values already in globals.css's
// :root[data-palette="X"] blocks. CSS custom properties can't be read
// back into JS without a live DOM query, and :root[data-palette] only
// ever matches the actual document root, not a small nested preview
// element carrying the same attribute for decoration — reusing the
// real cascade here would mean loosening that selector scheme
// site-wide for one nicety. A handful of hex values, kept in this one
// shared file rather than re-declared per-component, is the smaller
// real cost. Not shown for "ambergris" — it's the exact same color as
// "amber", so a picker offering it as an 8th, visually-identical
// swatch would just look like a bug, not an alias.
export const PALETTE_PREVIEW_COLORS: Record<Exclude<PaletteName, "ambergris">, string> = {
  persimmon: "#ff5a36",
  cobalt: "#3d8bff", // was "green" (#7cff3d) — direct request to
  // recolor it blue; see PALETTES' own comment on the rename
  amber: "#ffb300",
  "turbo-blue": "#ffffff",
  "phosphor-decay": "#2ee6a0", // was #33ff66 — see globals.css's own comment
  "stealth-obsidian": "#f9f9f9",
  "vapor-comm": "#a2b5ff",
};

// Applies (or clears, for the persimmon default) the real data-palette
// attribute the CSS reads, and persists the choice — the one place
// that actually touches document.documentElement/localStorage for
// this, called from both the terminal command and the restorer.
export function applyPalette(name: PaletteName) {
  const attr = resolvePaletteAttr(name);
  if (attr === "persimmon") {
    delete document.documentElement.dataset.palette;
  } else {
    document.documentElement.dataset.palette = attr;
  }
}

export function persistPalette(name: PaletteName) {
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, resolvePaletteAttr(name));
  } catch {
    // not persisted this session, but the in-memory swap still works
  }
}
