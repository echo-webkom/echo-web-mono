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

export default function AccessGranted() {
  return (
    <Html>
      <Head />
      <Preview>Du har fått tilgang til echo.uib.no</Preview>
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
              <Heading className="text-2xl font-semibold">Du har fått tilgang!</Heading>

              <Section>
                Velkommen! Prøv å logge inn på{" "}
                <a href="https://echo.uib.no" className="text-blue-600">
                  echo.uib.no
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
