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

type GotSpotNotificationProps = {
  name?: string;
  happeningTitle?: string;
};

export default function GotSpotNotification({
  name = "Bo Salhus",
  happeningTitle = "Workshop med Webkom",
}: GotSpotNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Du har fått plass på {happeningTitle}</Preview>
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
              <Heading className="text-2xl font-bold">Du har fått plass!</Heading>

              <Section>
                <Text className="text-gray-600">
                  Gratulere, {name}! Du har fått plass på {happeningTitle}.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
