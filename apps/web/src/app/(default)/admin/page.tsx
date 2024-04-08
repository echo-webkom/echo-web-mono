import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default function Dashboard() {
  return (
    <Container>
      <Heading className="mb-4">Dashboard</Heading>

      <p>Velkommen til dashboardet.</p>
    </Container>
  );
}
