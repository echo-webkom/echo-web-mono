/** @type {import("prettier").Config} */
export const config = {
  arrowParens: "always",
  printWidth: 100,
  singleQuote: false,
  jsxSingleQuote: false,
  bracketSpacing: true,
  semi: true,
  trailingComma: "all",
  tabWidth: 2,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: ["^(astro/(.*)$)|^(astro$)", "<THIRD_PARTY_MODULES>", "", "^@/(.*)$", "^[./]"],
  importOrderParserPlugins: ["typescript", "jsx"],
  importOrderTypeScriptVersion: "5.0.0",
};

export default config;
