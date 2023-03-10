/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["custom", "@sanity/eslint-config-studio"],
  rules: {
    "no-console": "off",
  },
};

module.exports = config;
