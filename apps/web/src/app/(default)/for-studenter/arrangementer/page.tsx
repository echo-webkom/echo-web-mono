import { Container } from "@/components/container";
import Events from "@/components/event-filter";

export default function HomePage() {
  return (
    <Container>
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <Events />
      </section>
    </Container>
  );
}
