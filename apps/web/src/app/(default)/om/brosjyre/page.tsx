import { type Metadata } from "next";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";

export const metadata = {
  title: "Brosjyre",
  description: "Brosjyren til echo",
} satisfies Metadata;

export default function Brochure() {
  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="flex-1 space-y-8">
        <Heading>Brosjyre</Heading>
        <iframe
          title="echo-brosjyre"
          style={{
            width: "100%",
            height: "800px",
          }}
          src="/echo-oppslag.pdf"
        ></iframe>
      </div>
    </Container>
  );
}
