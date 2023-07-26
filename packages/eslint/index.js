/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "turbo",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    eqeqeq: "error",
    "no-console": ["warn", {allow: ["warn", "error"]}],
    "eol-last": "error",
    "no-trailing-spaces": "error",
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
      {prefer: "type-imports", fixStyle: "inline-type-imports"},
    ],
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: ["node_modules", "dist", "coverage"],
};

module.exports = config;
