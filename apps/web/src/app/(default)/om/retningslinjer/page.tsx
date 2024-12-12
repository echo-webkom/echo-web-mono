import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

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
    <Container className="space-y-8 py-10">
      <div>
        <Heading>Etiske retningslinjer</Heading>
        <Text>
          De etiske retningslinjene til echo – Linjeforeningen for informatikk. Du kan og lese de på{" "}
          <a
            className="font-medium underline transition-colors duration-200 after:content-['_↗'] hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/echo-uib/Retningslinjer/blob/main/Etiske_retningslinjer.md"
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
