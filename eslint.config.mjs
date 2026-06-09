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
    // Vendored WordPress source (themes/db backup) — not our code:
    ".wp-source/**",
    // Migration tooling + generated artifacts — not shipped app code:
    "scripts/**",
    "data/**",
    "output/**",
    "public/media/**",
    "src/shared/config/redirects.generated.ts",
  ]),
]);

export default eslintConfig;
