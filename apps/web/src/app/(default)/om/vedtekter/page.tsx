import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";

export const metadata = {
  title: "Vedtekter",
  description: "Vedtektene til echo – Linjeforeningen for informatikk",
} satisfies Metadata;

export default async function Bylaws() {
  const markdown = await fetch(
    "https://raw.githubusercontent.com/echo-uib/Vedtekter/main/vedtekter.md",
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
        <div>
          <Heading>Vedtekter</Heading>
          <Text>
            Vedtektene til echo – Linjeforeningen for informatikk. Du kan og lese de på{" "}
            <a
              className="font-medium underline transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/echo-uib/Vedtekter"
            >
              GitHub
            </a>
            .
          </Text>
        </div>
        <Markdown content={markdown} />
      </div>
    </Container>
  );
}
