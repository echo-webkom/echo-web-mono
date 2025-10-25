import "@/styles/globals.css";

import { Fragment } from "react";
import { type Metadata, type Viewport } from "next";
import {
  Alfa_Slab_One,
  IBM_Plex_Mono,
  Inter,
  Lexend_Deca,
  Radley,
  Ranchers,
  Unna,
  VT323,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import NextTopLoader from "nextjs-toploader";

import { auth } from "@/auth/session";
import { AnimatedIcons, AnimatedSnowfall } from "@/components/animations/animated-icons";
import { EasterEgg } from "@/components/easter-egg";
import { FeedbackBlob } from "@/components/feedback-blob";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/toaster";
import { BASE_URL } from "@/config";
import { cn } from "@/utils/cn";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-ibm",
});

const ibmPlexMonoDisplay = IBM_Plex_Mono({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-ibm-display",
});

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-block",
  weight: ["400"],
});

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-ranchers",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-lexend",
});

const unna = Unna({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-unna",
});

const radley = Radley({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-radley",
});

const slab = Alfa_Slab_One({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-slab",
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "echo – Linjeforeningen for informatikk",
    template: "%s | echo – Linjeforeningen for informatikk",
  },
  description: "Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen.",
  applicationName: "echo",
  creator: "echo-webkom",
  authors: {
    name: "echo-webkom",
    url: "/webkom",
  },
  metadataBase: new URL(BASE_URL),
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
};

export const viewport: Viewport = {
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
};

const ThemeWrapper = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: "christmas" | "halloween" | "default";
}) => {
  const InnerWrapper =
    theme === "halloween" ? AnimatedIcons : theme === "christmas" ? AnimatedSnowfall : Fragment;
  const n = theme === "halloween" ? 40 : theme === "christmas" ? 40 : undefined;
  if (!n) {
    return <>{children}</>;
  }

  return <InnerWrapper n={n}>{children}</InnerWrapper>;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await auth();
  const date = new Date();
  const month = date.getMonth();
  const isOctober = month === 9;
  const isChristmas = (month === 10 && date.getDate() >= 16) || month === 11;
  const theme = isOctober ? "halloween" : isChristmas ? "christmas" : "default";

  return (
    <html lang="no" data-theme={theme} suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "bg-background font-primary min-h-screen antialiased",
          inter.variable,
          ibmPlexMono.variable,
          ibmPlexMonoDisplay.variable,
          vt323.variable,
          ranchers.variable,
          lexendDeca.variable,
          unna.variable,
          radley.variable,
          slab.variable,
        )}
      >
        <Providers user={user}>
          <ThemeWrapper theme={theme}>
            <NextTopLoader color="#ffeabb" height={5} showSpinner={false} />

            {children}
            <Toaster />
            <FeedbackBlob />
            <TailwindIndicator />
            <EasterEgg />
          </ThemeWrapper>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
