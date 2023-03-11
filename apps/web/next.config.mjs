// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    domains: ["cdn.sanity.io"],
  },

  i18n: {
    locales: ["no", "en"],
    defaultLocale: "no",
  },

  eslint: {ignoreDuringBuilds: !!process.env.CI},
};
export default config;
