import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored Draco decoder (copied verbatim from three's own bundled
    // copy, see SkyboxCanvas.tsx's DRACO_DECODER_PATH comment) — a
    // generated Emscripten/WASM wrapper, not this app's source; linting
    // it was never meaningful and only surfaced noise from code no one
    // here wrote or should edit.
    "public/draco/**",
  ]),
]);

export default eslintConfig;
