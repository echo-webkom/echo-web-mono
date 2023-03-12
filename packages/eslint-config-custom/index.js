module.exports = {
  root: true,
  extends: [
    "next",
    "turbo",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
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
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "no-console": ["error", {allow: ["warn", "error"]}],
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
    // "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {prefer: "type-imports", fixStyle: "inline-type-imports"},
    ],
  },
  ignorePatterns: ["**/*.config.js", "**/*.config.cjs"],
};
