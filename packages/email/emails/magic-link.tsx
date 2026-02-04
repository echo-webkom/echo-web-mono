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

type MagicLinkProps = {
  magicLinkUrl: string;
  code: string;
  firstName?: string;
};

export default function MagicLinkEmail({ magicLinkUrl, code, firstName = "der" }: MagicLinkProps) {
  return (
    <Html>
      <Head />
      <Preview>Din magic link til å logge inn på echo</Preview>
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
              <Heading className="text-3xl font-bold">Logg inn på echo</Heading>

              <Text className="text-gray-600">Hei {firstName}!</Text>

              <Text className="text-gray-600">
                Klikk på knappen under for å logge inn på echo, eller bruk koden nedenfor. Denne
                lenken er gyldig i 5 minutter.
              </Text>

              <Section className="my-8">
                <Button
                  className="rounded bg-blue-600 px-6 py-3 text-center text-white no-underline"
                  href={magicLinkUrl}
                >
                  Logg inn
                </Button>
              </Section>

              <Text className="text-gray-600">Eller bruk denne koden:</Text>

              <Section className="my-6">
                <Text
                  className="text-4xl font-bold tracking-widest"
                  style={{ fontFamily: "monospace", letterSpacing: "0.5em" }}
                >
                  {code}
                </Text>
              </Section>

              <Text className="text-sm text-gray-500">
                Hvis du ikke kan klikke på knappen, kan du kopiere og lime inn denne lenken i
                nettleseren din:
              </Text>

              <Text className="break-all text-sm text-gray-400">{magicLinkUrl}</Text>

              <Text className="text-sm text-gray-500">
                Hvis du ikke har bedt om en innloggingslenke, kan du trygt ignorere denne e-posten.
              </Text>

              <Text className="text-xs text-gray-400">
                Denne lenken og koden utløper automatisk etter 5 minutter av sikkerhetshensyn.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
