import "@/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { IBM_Plex_Mono, Inter, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";

import { FeedbackBlob } from "@/components/feedback-blob";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/toaster";
import { BASE_URL } from "@/config";
import { cn } from "@/utils/cn";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter-font",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "500",
  subsets: ["latin"],
  variable: "--ibm-font",
});

const ibmPlexMonoDisplay = IBM_Plex_Mono({
  weight: "700",
  subsets: ["latin"],
  variable: "--inter-display-font",
});

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--block-font",
  weight: ["400"],
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "echo – Linjeforeningen for informatikk",
    template: "%s | echo – Linjeforeningen for informatikk",
  },
  description: "Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen.",
  keywords: ["echo", "linjeforening", "informatikk", "lesesalen", "bergen"],
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon-32x32.png",
    shortcut: "/favicon16x16.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "echo",
  },
} satisfies Metadata;

export const viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: dark)",
      color: "#151210",
    },
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffeabb",
    },
  ],
  width: "device-width",
  height: "device-height",
  initialScale: 1.0,
} satisfies Viewport;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-primary antialiased",
          inter.variable,
          ibmPlexMono.variable,
          ibmPlexMonoDisplay.variable,
          vt323.variable,
        )}
      >
        <NextTopLoader color="#ffeabb" height={5} showSpinner={false} />
        <Providers>
          {children}
          <Toaster />
          {/* <CookieBanner /> */}
          <FeedbackBlob />
          <TailwindIndicator />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
