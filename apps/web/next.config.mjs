import NextBundleAnalyzer from "@next/bundle-analyzer";

import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  experimental: {
    appDir: false,
  },

  transpilePackages: [
    "@echo-webkom/api",
    "@echo-webkom/auth",
    "@echo-webkom/db",
    "@echo-webkom/lib",
    "@echo-webkom/tailwind-config",
  ],

  images: {
    domains: ["cdn.sanity.io"],
  },

  eslint: {ignoreDuringBuilds: !!process.env.CI},
  typescript: {ignoreBuildErrors: !!process.env.CI},
};

const withBundleAnalyzer = NextBundleAnalyzer({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(config);
