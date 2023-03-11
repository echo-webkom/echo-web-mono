module.exports = {
  root: true,
  extends: [
    "next",
    "turbo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  env: {
    es6: true,
  },
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: "latest",
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {prefer: "type-imports", fixStyle: "inline-type-imports"},
    ],
    "no-console": ["error", {allow: ["warn", "error"]}],
  },
  ignorePatterns: ["**/*.config.js", "**/*.config.cjs"],
};
