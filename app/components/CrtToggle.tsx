"use client";

import { useCrt } from "./crt-context";

export default function CrtToggle() {
  const { enabled, setEnabled } = useCrt();
  return (
    <button
      type="button"
      className="flag crt-toggle"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={`CRT scanline overlay: ${enabled ? "on" : "off"}. Activate to turn ${
        enabled ? "off" : "on"
      }.`}
    >
      --crt={enabled ? "on" : "off"}
    </button>
  );
}
