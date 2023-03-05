module.exports = {
  extends: ["eslint:recommended", "turbo", "prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react/recommended",
      ],
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        ecmaVersion: "latest",
        tsconfigRootDir: __dirname,
        project: [
          "./tsconfig.json",
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json",
        ],
      },
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-throw-literal": "error",
        "no-console": "error",
        curly: "error",
        "react/jsx-curly-brace-presence": [
          "error",
          {props: "never", children: "never", propElementValues: "always"},
        ],
      },
    },
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/config/**",
  ],
};
