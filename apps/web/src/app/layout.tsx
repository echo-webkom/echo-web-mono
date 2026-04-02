import "@/styles/globals.css";
import { type Metadata, type Viewport } from "next";
import { IBM_Plex_Mono, Inter, VT323 } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { auth, getSessionToken } from "@/auth/session";
import { DevtoolsLoginDialog } from "@/components/devtools/devtools-login-dialog";
import { TailwindIndicator } from "@/components/devtools/tailwind-indicator";
import { EasterEgg } from "@/components/easter-egg";
import { FeedbackBlob } from "@/components/feedback-blob";
import { Toaster } from "@/components/toaster";
import { BASE_URL, IS_DEVTOOLS_ENABLED } from "@/config";
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

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-block",
  weight: ["400"],
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

export default async function RootLayout({ children }: RootLayoutProps) {
  const [user, sessionToken] = await Promise.all([auth(), getSessionToken()]);
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
          vt323.variable,
        )}
      >
        <Providers user={user} sessionToken={sessionToken}>
          <NextTopLoader color="#ffeabb" height={5} showSpinner={false} />
          {children}
          <Toaster />
          <FeedbackBlob />
          <TailwindIndicator />
          <EasterEgg />
          {IS_DEVTOOLS_ENABLED && <DevtoolsLoginDialog />}
        </Providers>
      </body>
    </html>
  );
}
