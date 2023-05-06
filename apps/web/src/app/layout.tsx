import {IBM_Plex_Mono, Inter} from "next/font/google";

import "@/styles/globals.css";
import {Toaster} from "@/components/toaster";
import {cn} from "@/utils/cn";

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

export const metadata = {
  title: {
    default: "echo Web",
    template: "%s | echo Web",
  },
  description: "Nettsiden til echo — linjeforeningen for informatikk ved Universitetet i Bergen.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
