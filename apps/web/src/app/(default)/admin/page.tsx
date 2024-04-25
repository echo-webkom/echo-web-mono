import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default function Dashboard() {
  return (
    <Container className="py-10">
      <Heading className="mb-4">Dashboard</Heading>

      <p>Velkommen til dashboardet.</p>
    </Container>
  );
}
