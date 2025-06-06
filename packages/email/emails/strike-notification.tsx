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

type StrikeNotificationEmailProps = {
  name?: string;
  reason?: string;
  amount?: number;
  isBanned?: boolean;
};

export default function StrikeNotificationEmail({
  name = "Bo Salhus",
  reason = "Kom for sent",
  amount = 3,
  isBanned = false,
}: StrikeNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>VIKITG: Du har fått prikk</Preview>
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
              <Heading className="mb-4 text-2xl font-bold">
                Du har mottatt {amount > 1 ? `${amount} prikker` : "en prikk"}
              </Heading>

              <Section>
                <Text className="text-gray-600">Hei, {name}.</Text>

                <Text className="mt-4 text-gray-600">
                  Du har motatt {amount} prikk{amount > 1 ? "er" : ""} grunnet:
                </Text>

                <Text className="mt-4 italic text-gray-600">
                  {'"'}
                  {reason}
                  {'"'}
                </Text>

                {isBanned && (
                  <Text className="mt-4 text-gray-600">
                    Siden dette har ført til at du har 5 prikker, vil du bli utestengt fra å melde
                    deg på arrangementer i en periode. Besøk profil-siden din for mer informasjon.
                  </Text>
                )}
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
