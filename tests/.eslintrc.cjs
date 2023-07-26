/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["webkom"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
