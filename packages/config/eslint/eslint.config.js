const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      eqeqeq: "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "eol-last": "error",
      "no-trailing-spaces": "error",
      "prefer-arrow-callback": ["error"],
      "arrow-parens": ["error"],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "*.config.js",
      "*.config.cjs", 
      "*.config.mjs",
    ],
  },
];