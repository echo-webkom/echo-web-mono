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
} from "jsx-email";

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
                src="https://cdn.sanity.io/images/pgq2pd26/production/b3eacd94f92e9041f7ece0346f27db0c9e520f60-512x512.png"
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
