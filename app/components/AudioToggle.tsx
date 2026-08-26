"use client";

import { useAudio } from "./audio-context";

export default function AudioToggle() {
  const { enabled, setEnabled } = useAudio();
  return (
    <button
      type="button"
      className="flag audio-toggle"
      onClick={() => setEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={`Sound effects: ${enabled ? "on" : "off"}. Activate to turn ${
        enabled ? "off" : "on"
      }.`}
    >
      --audio={enabled ? "on" : "off"}
    </button>
  );
}
