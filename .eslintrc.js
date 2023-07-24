/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["custom"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
      "./packages/config/*/tsconfig.json",
      "./tests/tsconfig.json",
    ],
    jsx: true,
  },
  settings: {
    next: {
      rootDir: ["apps/web"],
    },
  },
  ignorePatterns: ["node_modules", "dist", "coverage", "apps/web/.next", "*.mdx", "*.md"],
};

module.exports = config;
