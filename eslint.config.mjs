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
    // 참고본은 실행되는 src 코드와 분리한다(.agent/rules/mockup.md).
    "_mockup/**",
    // 라우트·import가 없는 기존 단독 설문 시안.
    "wearless-survey-3-6.jsx",
  ]),
]);

export default eslintConfig;
