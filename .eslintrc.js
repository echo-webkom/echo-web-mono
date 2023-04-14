/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["custom"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
    jsx: true,
  },
  settings: {
    next: {
      rootDir: ["apps/web"],
    },
  },
};

module.exports = config;
