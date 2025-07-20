const js = require("@eslint/js");
const ts = require("typescript-eslint");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const nextPlugin = require("@next/eslint-plugin-next");
const globals = require("globals");

module.exports = ts.config(
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...ts.configs.stylisticTypeChecked,
  react.configs.flat.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "writable",
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Base rules
      eqeqeq: "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "eol-last": "error",
      "no-trailing-spaces": "error",
      "prefer-arrow-callback": ["error"],
      "arrow-parens": ["error"],
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
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
      "@typescript-eslint/array-type": ["error", { default: "generic", readonly: "generic" }],
      "@typescript-eslint/consistent-type-definitions": ["off"],
      // React rules
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules,
      // Next.js rules
      "@next/next/no-html-link-for-pages": "off",
      ...nextPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: [".next/**", "dist/**", "node_modules/**"],
  },
);
