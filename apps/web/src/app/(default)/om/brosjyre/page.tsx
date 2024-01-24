import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export const metadata: Metadata = {
  title: "Brosjyre",
  description: "Brosjyren til echo",
};

export default function Brochure() {
  return (
    <Container>
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
