/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["webkom/nextjs"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
};
