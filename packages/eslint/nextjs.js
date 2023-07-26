/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [require.resolve("./index.js"), "next/core-web-vitals"],
};

module.exports = config;
