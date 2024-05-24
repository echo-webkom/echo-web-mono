import { type Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Heading } from "@/components/typography/heading";

export const metadata: Metadata = {
  title: "Brosjyre",
  description: "Brosjyren til echo",
};

export default function Brochure() {
  return (
    <Container className="space-y-8 py-10">
      <Heading>Brosjyre</Heading>
      <iframe
        title="echo-brosjyre"
        style={{
          width: "100%",
          height: "800px",
        }}
        src="https://www.visbrosjyre.no/echo/WebView/"
      ></iframe>
    </Container>
  );
}
