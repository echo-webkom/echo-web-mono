import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type RegistrationConfirmationEmailProps = {
  title?: string;
  isBedpres?: boolean;
};

export default function RegistrationConfirmationEmail({
  title = "Workshop med Webkom",
  isBedpres = false,
}: RegistrationConfirmationEmailProps) {
  const typeText = isBedpres ? "bedriftspresentasjonen" : "arrangmentet";

  return (
    <Html>
      <Head />
      <Preview>Du har fått plass på {title}.</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-8 w-full max-w-screen-sm border border-solid border-gray-200">
            <Section className="px-8 py-12 text-center">
              <Img
                src="https://cdn.sanity.io/images/nnumy1ga/production/bdd61d39436a25c6fae33b4c22875e52bd650fad-512x512.png"
                width="75"
                height="75"
                alt="echo"
                style={{ margin: "auto" }}
              />
              <Heading className="text-3xl font-bold">Du har fått plass!</Heading>

              <Text className="text-gray-600">
                Du har fått plass på {typeText}, {title}.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
