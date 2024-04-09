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

type StrikeNotificationEmailProps = {
  name?: string;
  reason?: string;
  happeningTitle?: string;
  amount?: number;
  isBanned?: boolean;
};

export default function StrikeNotificationEmail({
  name = "Bo Salhus",
  reason = "Jeg har blitt syk",
  happeningTitle = "Workshop med Webkom",
  amount = 1,
  isBanned = true,
}: StrikeNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Du har fått {amount} ny(e) prikk(er)</Preview>
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
                Du har fått {amount > 1 ? "nye prikker" : "ny prikk"}
              </Heading>

              <Section>
                <Text className="text-gray-600">
                  {name} har fått {amount > 1 ? amount + " nye prikker" : "ny prikk"} fra `
                  {happeningTitle}` med følgende grunn:
                </Text>

                <Text className="rounded-md bg-gray-100 p-4 text-gray-600">{reason}</Text>
                {isBanned || reason === "Du møtte ikke opp." ? (
                  <Text className="text-gray-600">
                    Du har blitt bannet fra de 3 neste bedpressene du kunne ha deltatt i.
                  </Text>
                ) : null}
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
