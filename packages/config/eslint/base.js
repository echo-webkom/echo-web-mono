/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    eqeqeq: "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "eol-last": "error",
    "no-trailing-spaces": "error",
    "prefer-arrow-callback": ["error"],
    "arrow-parens": ["error"],
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports", fixStyle: "inline-type-imports" },
    ],
    "arrow-parens": ["error"],
    "@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
    "@typescript-eslint/consistent-type-definitions": ["off"],
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    "**/.eslintrc.cjs",
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/config/**",
    ".next",
    "dist",
    "pnpm-lock.yaml",
  ],
};
