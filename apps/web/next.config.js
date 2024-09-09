/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",

  transpilePackages: [
    "@echo-webkom/auth",
    "@echo-webkom/db",
    "@echo-webkom/lib",
    "@echo-webkom/email",
  ],

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  cacheHandler:
    process.env.NODE_ENV === "production" ? require.resolve("./cache-handler.js") : undefined,

  env: {
    NEXT_PUBLIC_REDIS_INSIGHT_URL: process.env.REDIS_INSIGHT_URL ?? "http://localhost:4444",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // eslint-disable-next-line @typescript-eslint/require-await
  redirects: async () => [
    {
      source: "/events/:path",
      destination: "/event/:path",
      statusCode: 301,
    },
    {
      source: "/jobb",
      destination: "/for-studenter/jobber",
      statusCode: 301,
    },
    {
      source: "/jobb/:path",
      destination: "/for-studenter/jobb/:path",
      statusCode: 301,
    },
    {
      source: "/om-echo/:path",
      destination: "/om/:path",
      statusCode: 301,
    },
    {
      source: "/posts",
      destination: "/for-studenter/innlegg",
      statusCode: 301,
    },
    {
      source: "/posts/:path",
      destination: "/for-studenter/innlegg/:path",
      statusCode: 301,
    },
    {
      source: "/om-echo/studentgrupper/:path",
      destination: "/for-studenter/gruppe/:path",
      statusCode: 301,
    },
    {
      source: "/arrangementer",
      destination: "/for-studenter/arrangementer",
      statusCode: 301,
    },
    {
      source: "/innlegg/:path",
      destination: "/for-studenter/innlegg/:path",
      statusCode: 301,
    },
    {
      source: "/for-studenter/si-ifra",
      destination: "/for-studenter/speak-up",
      statusCode: 301,
    },
  ],

  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
};

module.exports = config;
