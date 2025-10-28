import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchHeader } from "@/sanity/header";

export const metadata: Metadata = {
  title: "Etiske retningslinjer",
  description: "De etiske retningslinjene til echo – Linjeforeningen for informatikk",
};

export default async function EthicalGuidelines() {
  const markdown = await fetch(
    "https://raw.githubusercontent.com/echo-uib/Retningslinjer/main/Etiske_retningslinjer.md",
    {
      next: {
        revalidate: 5000,
      },
    },
  ).then((res) => res.text());
  const header = await fetchHeader();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar header={header} />

      <div className="space-y-8">
        <Markdown content={markdown} />
      </div>
    </Container>
  );
}
