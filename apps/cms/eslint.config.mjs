import studio from "@sanity/eslint-config-studio";

/** @type {import("eslint").Linter.Config} */
export default [
  ...studio,
  {
    ignores: ["migrations/", "sanity.types.ts"],
  },
];
