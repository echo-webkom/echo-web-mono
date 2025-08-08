import * as React from "react";
import {
  Body,
  Button,
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

type EmailVerificationProps = {
  verificationUrl: string;
  firstName?: string;
};

export default function EmailVerificationEmail({
  verificationUrl,
  firstName = "der",
}: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Bekreft e-postadressen din for echo</Preview>
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
              <Heading className="text-3xl font-bold">Velkommen til echo!</Heading>

              <Text className="text-gray-600">Hei {firstName}!.</Text>

              <Text className="text-gray-600">
                Vi trenger at du bekrefter den alternative e-postaddressen din for at vi skal kunne
                bruke den.
              </Text>

              <Section className="my-8">
                <Button
                  className="rounded bg-blue-600 px-6 py-3 text-center text-white no-underline"
                  href={verificationUrl}
                >
                  Bekreft e-postadresse
                </Button>
              </Section>

              <Text className="text-sm text-gray-500">
                Hvis du ikke kan klikke på knappen, kan du kopiere og lime inn denne lenken i
                nettleseren din:
              </Text>

              <Text className="break-all text-sm text-gray-400">{verificationUrl}</Text>

              <Text className="text-sm text-gray-500">
                Hvis du ikke vet hva echo er, eller ikke har lagt til denne e-postadressen selv, kan
                du trygt ignorere denne e-posten.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
