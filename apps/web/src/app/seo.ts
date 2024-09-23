import { type TemplateString } from "next/dist/lib/metadata/types/metadata-types";
import { type Metadata } from "next/types";

import { BASE_URL } from "@/config";

export function getNewPageMetadata(title: string | TemplateString, description: string): Metadata {
  return {
    title,
    description,
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
}

export function getDefaultPageMetadata(): Metadata {
  return getNewPageMetadata(
    {
      default: "echo – Linjeforeningen for informatikk",
      template: "%s | echo – Linjeforeningen for informatikk",
    },
    "Nettsiden til echo – Linjeforeningen for informatikk ved Universitetet i Bergen.",
  );
}
