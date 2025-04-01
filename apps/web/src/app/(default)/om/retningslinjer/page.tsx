import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";

export const metadata = {
  title: "Etiske retningslinjer",
  description: "De etiske retningslinjene til echo – Linjeforeningen for informatikk",
} satisfies Metadata;

export default async function EthicalGuidelines() {
  const markdown = await fetch(
    "https://raw.githubusercontent.com/echo-uib/Retningslinjer/main/Etiske_retningslinjer.md",
    {
      next: {
        revalidate: 5000,
      },
    },
  ).then((res) => res.text());

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="space-y-8">
        <Markdown content={markdown} />
      </div>
    </Container>
  );
}
