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

type DeregistrationNotificationEmailProps = {
  email?: string;
  reason?: string;
};

export default function AcccessRequestNotificationEmail({
  email = "bo.salhus@echo.uib.no",
  reason = "Jeg har blitt syk",
}: DeregistrationNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{email} ønsker tilgang til echo.uib.no</Preview>
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
                {email} ønsker tilgang til echo.uib.no
              </Heading>

              <Section>
                <Text className="text-gray-600">
                  {email} ønsker tilgang til echo.uib.no med følgende grunn:
                </Text>

                <Text className="rounded-md bg-gray-100 p-4 text-gray-600">{reason}</Text>
              </Section>

              <Section>
                <Text className="text-gray-600">
                  Du kan godkjenne eller avvise forespørselen på whitelist-dashbordet.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
