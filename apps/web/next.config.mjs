import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@echo-webkom/auth", "@echo-webkom/db", "@echo-webkom/lib"],

  images: {
    domains: ["cdn.sanity.io"],
  },

  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
};

export default config;
