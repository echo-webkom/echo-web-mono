import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { createWebkomPage } from "@/lib/factories/page";

export default createWebkomPage(() => {
  return (
    <Container>
      <Heading className="mb-4">Dashboard</Heading>

      <p>Velkommen til dashboardet. Bla blab blabblalb bal</p>
    </Container>
  );
});
