import studio from "@sanity/eslint-config-studio";

export default [
  ...studio,
  {
    ignores: ["migrations/**", "sanity.types.ts"],
  },
];
