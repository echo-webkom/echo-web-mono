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
} from "@react-email/components";

type AccessDeniedProps = {
  reason?: string;
};

export default function AccessDenied({ reason }: AccessDeniedProps) {
  return (
    <Html>
      <Head />
      <Preview>Din forespørsel om tilgang til echo.uib.no har blitt avslått</Preview>
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
              <Heading className="text-2xl font-semibold">Tilgang ikke godkjent</Heading>

              <Section>
                Din forespørsel om tilgang til{" "}
                <a href="https://echo.uib.no" className="text-blue-600">
                  echo.uib.no
                </a>{" "}
                har dessverre blitt avslått.
              </Section>

              {reason && (
                <Section className="mt-4 rounded-md bg-gray-50 p-4 text-left">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Begrunnelse:</div>
                  <div className="text-sm text-gray-600">{reason}</div>
                </Section>
              )}

              <Section className="mt-4 text-sm text-gray-600">
                Hvis du mener dette er en feil, kan du kontakte oss på{" "}
                <a href="mailto:webkom@echo.uib.no" className="text-blue-600">
                  webkom@echo.uib.no
                </a>
                .
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
