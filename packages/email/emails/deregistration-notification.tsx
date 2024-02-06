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

type DeregistrationNotificationEmailProps = {
  name?: string;
  reason?: string;
  happeningTitle?: string;
};

export default function DeregistrationNotificationEmail({
  name = "Bo Salhus",
  reason = "Jeg har blitt syk",
  happeningTitle = "Workshop med Webkom",
}: DeregistrationNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {name} har meldt seg av {happeningTitle}
      </Preview>
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
              <Heading className="text-2xl font-bold">
                {name} har meldt seg av {happeningTitle}
              </Heading>

              <Section>
                <Text className="text-gray-600">{name} har meldt seg av med følgende grunn:</Text>

                <Text className="rounded-md bg-gray-100 p-4 text-gray-600">{reason}</Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
