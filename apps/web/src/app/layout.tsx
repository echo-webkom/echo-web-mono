import "@/styles/globals.css";

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
import NextTopLoader from "nextjs-toploader";

import { EasterEgg } from "@/components/easter-egg";
import { FeedbackBlob } from "@/components/feedback-blob";
import { MembershipFeeModal } from "@/components/membership-fee-modal";
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

const ranchers = Ranchers({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--ranchers-font",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--lexend-font",
});

const unna = Unna({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--unna-font",
});

const radley = Radley({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--radley-font",
});

const slab = Alfa_Slab_One({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--slab-font",
});

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata = {
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
  const date = new Date();
  const month = date.getMonth();
  const isOctober = month === 9;
  const isChristmas = (month === 10 && date.getDate() >= 16) || month === 11;

  // Refactor how we apply dynamic theme to the site
  // const ThemeWrapper = isOctober ? AnimatedIcons : isChristmas ? AnimatedSnowfall : Fragment;
  // const n = isOctober ? 40 : isChristmas ? 40 : undefined;

  return (
    <html
      lang="no"
      data-theme={isOctober ? "halloween" : isChristmas ? "christmas" : "default"}
      suppressHydrationWarning
    >
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-primary antialiased",
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
        <Providers>
          {/* <ThemeWrapper> */}
          <NextTopLoader color="#ffeabb" height={5} showSpinner={false} />

          {children}
          <Toaster />
          <FeedbackBlob />
          <TailwindIndicator />
          <EasterEgg />

          <MembershipFeeModal />
          {/* </ThemeWrapper> */}
        </Providers>
      </body>
    </html>
  );
}
