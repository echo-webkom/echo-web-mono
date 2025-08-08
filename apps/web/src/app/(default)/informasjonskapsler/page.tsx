import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";

const content = `
# Informasjonskapsler

Vi bruker informasjonskapsler, også kalt cookies, for å forbedre brukeropplevelsen din på
nettsiden vår.

Vi bruker ingen informasjonskapsler for å spore deg eller lagre personlig informasjon om deg.

Informasjonskapslene vi bruker er:

- \`cookie-banner\` - brukes til å lagre om du har lukket cookie-banneret eller ikke. (Ikke i bruk)
- \`session-token\` - brukes til å lagre innloggingsstatusen din.
`;

export default function Cookies() {
  return (
    <Container className="py-10">
      <Markdown content={content} />
    </Container>
  );
}
