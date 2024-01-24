import { Container } from "@/components/container";
import { Markdown } from "@/components/markdown";

const content = `
# Informasjonskapsler

Vi bruker informasjonskapsler, også kalt cookies, for å forbedre brukeropplevelsen din på
nettsiden vår.

Vi bruker ingen informasjonskapsler for å spore deg eller lagre personlig informasjon om deg.

Informasjonskapslene vi bruker er:

- \`cookie-banner\` - brukes til å lagre om du har lukket cookie-banneret eller ikke. (Ikke i bruk)
- \`next-auth.session-token\` - brukes til å lagre innloggingsstatusen din.
- \`next-auth.callback-url\` - brukes til å lagre callback-urlen din.
- \`next-auth.csrf-token\` - brukes til å lagre CSRF-tokenet ditt.
`;

export default function Cookies() {
  return (
    <Container>
      <Markdown content={content} />
    </Container>
  );
}
