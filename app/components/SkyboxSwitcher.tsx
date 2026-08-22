"use client";

import { useSkybox } from "./skybox-context";

export default function SkyboxSwitcher() {
  const { active, next } = useSkybox();
  return (
    <button
      type="button"
      className="flag skybox-switcher"
      onClick={next}
      aria-label={`Skybox: ${active}. Activate to switch to the next one.`}
    >
      --skybox={active}
    </button>
  );
}
