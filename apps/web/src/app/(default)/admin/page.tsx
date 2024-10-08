import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export default function Dashboard() {
  return (
    <Container>
      <Heading className="mb-4">Dashboard</Heading>

      <Text>
        Velkommen til dashboardet. Her kan du se en oversikt over happenings, tilbakemeldinger,
        brukere, grupper, studieretninger og whitelist.
      </Text>
    </Container>
  );
}
