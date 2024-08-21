import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export const metadata: Metadata = {
  title: "Vedtekter",
  description: "Vedtektene til echo – Linjeforeningen for informatikk",
};

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
    <Container className="space-y-8 py-10">
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
    </Container>
  );
}
