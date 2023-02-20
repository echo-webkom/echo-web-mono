/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  i18n: {
    locales: ["no"],
    defaultLocale: "no",
  },

  transpilePackages: [
    "@echo-webkom/api",
    "@echo-webkom/auth",
    "@echo-webkom/db",
    "@echo-webkom/tailwind-config",
  ],
};
export default config;
