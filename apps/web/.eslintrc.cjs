/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  rules: {
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "no-console": ["error", {allow: ["warn", "error"]}],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {prefer: "type-imports", fixStyle: "inline-type-imports"},
    ],
  },
  ignorePatterns: ["**/*.config.js", "**/*.config.cjs"],
};

module.exports = config;
