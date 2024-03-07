import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

export default function StrikesDashboard() {
  return (
    <Container>
      <Heading>Dashboard</Heading>
      <p>Her skal det komme informasjon om hvordan man bruker prikkesystemet. </p>
      <p>
        I tillegg blir det mulig å lage nye prikketyper, endre på hvor mange prikker man trenger for
        å bli bannet, hvor lenge man blir bannet, m.m.
      </p>
    </Container>
  );
}
