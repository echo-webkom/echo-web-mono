import Image from "next/image";

import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";
import { Heading } from "@/components/typography/heading";

const body =
  "Macbooken i taket ble limt fast i taket en gang i 2017. Den har overlevd alt av fester, oppussinger og eksamensperioder. Ryktene sier at den fortsatt fungerer.";

export default function MacOnRoof() {
  return (
    <Container className="py-10">
      <Heading className="mb-4">Macbook-en i taket</Heading>
      <Markdown className="text-lg" content={body} />

      <Image src="/mac.jpg" alt="macbook i taket" className="h-96 w-96 border"></Image>
    </Container>
  );
}
