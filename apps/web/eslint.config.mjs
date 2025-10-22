import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "eslint.config.*",
    "next-env.d.ts",
    "postcss.config.*",
    "prettier.config.*",
    "out/**",
    "build/**",
  ]),
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
      "@typescript-eslint/consistent-type-definitions": ["off"],
    },
  },
  react.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "writable",
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      eqeqeq: "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "eol-last": "error",
      "no-trailing-spaces": "error",
      "prefer-arrow-callback": ["error"],
      "arrow-parens": ["error"],
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: [
      "**/postcss.config.*",
      "**/prettier.config.*",
      "**/tailwind.config.*",
      "**/vitest.config.*",
    ],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
]);
