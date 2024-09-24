import "@/styles/globals.css";

import { type Viewport } from "next";
import { IBM_Plex_Mono, Inter, VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";

import { EasterEgg } from "@/components/easter-egg";
import { FeedbackBlob } from "@/components/feedback-blob";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/toaster";
import { cn } from "@/utils/cn";
import { Providers } from "./providers";
import { getNewPageMetadata } from "./seo";

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

export const metadata = getNewPageMetadata();

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
          <EasterEgg />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
