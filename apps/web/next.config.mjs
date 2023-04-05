import NextBundleAnalyzer from "@next/bundle-analyzer";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  transpilePackages: ["@echo-webkom/api", "@echo-webkom/auth", "@echo-webkom/db"],

  images: {
    domains: ["cdn.sanity.io"],
  },

  // i18n: {
  //   locales: ["no", "en"],
  //   defaultLocale: "no",
  // },

  eslint: {ignoreDuringBuilds: !!process.env.CI},
  typescript: {ignoreBuildErrors: !!process.env.CI},
};

const withBundleAnalyzer = NextBundleAnalyzer({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(config);
