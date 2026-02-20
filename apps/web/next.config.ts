import type { NextConfig } from "next";

let NEXT_OUTPUT = process.env.NEXT_OUTPUT as "export" | "standalone" | undefined;

if (NEXT_OUTPUT && !["export", "standalone"]?.includes(NEXT_OUTPUT)) {
  NEXT_OUTPUT = undefined;
}

const config = {
  reactCompiler: true,
  output: NEXT_OUTPUT,

  transpilePackages: [
    "@echo-webkom/db",
    "@echo-webkom/lib",
    "@echo-webkom/email",
    "@echo-webkom/sanity",
  ],

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "*.echo-webkom.no",
      },
    ],
  },

  // eslint-disable-next-line @typescript-eslint/require-await
  async redirects() {
    return [
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
        source: "/for-studenter/jobber",
        destination: "/for-studenter/stillingsannonser",
        statusCode: 301,
      },
      {
        source: "/for-studenter/jobb/:path",
        destination: "/for-studenter/stillingsannonse/:path",
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
    ];
  },

  skipTrailingSlashRedirect: true,

  typescript: { ignoreBuildErrors: !!process.env.CI },
} satisfies NextConfig;

export default config;
