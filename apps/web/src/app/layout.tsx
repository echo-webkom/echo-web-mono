import {IBM_Plex_Mono, Inter} from "next/font/google";

import "@/styles/globals.css";

import {type Metadata} from "next";

import Feedback from "@/components/feedback";
import {Toaster} from "@/components/toaster";
import {cn} from "@/utils/cn";
import AuthProvider from "./auth-provider";

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

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
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
  viewport: "width=device-width, initial-scale=1.0",
  themeColor: "#008fa3",
  appleWebApp: {
    title: "echo",
  },
};

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <html lang="no" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-primary antialiased",
          inter.variable,
          ibmPlexMono.variable,
          ibmPlexMonoDisplay.variable,
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
          <Feedback />
        </AuthProvider>
      </body>
    </html>
  );
}
