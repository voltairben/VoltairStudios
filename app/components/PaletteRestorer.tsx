"use client";

import { useEffect } from "react";
import { PALETTE_STORAGE_KEY, applyPalette, isPaletteName } from "../data/palette";

// Rendered once at the root (layout.tsx), not inside TerminalInput —
// direct bug found live: the theme command's own restore effect used
// to live only in TerminalInput.tsx, which is homepage-only content.
// A saved choice restored fine on reload of "/", but a fresh load of
// /about or a case-study page never ran that effect at all and always
// showed persimmon regardless of what was actually saved — caught by
// testing a real cross-page navigation, not assumed to work because
// the homepage case did. This component's only job is running that
// same restore on every page.
export default function PaletteRestorer() {
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(PALETTE_STORAGE_KEY);
    } catch {
      // localStorage blocked — default persimmon stands
    }
    if (stored && isPaletteName(stored)) applyPalette(stored);
  }, []);
  return null;
}
