import { Container } from "@/components/container";
import Events from "@/components/event-filter";

export default function HomePage() {
  return (
    <Container className="grid grid-cols-1 gap-x-5 gap-y-12 px-3">
      {/* Events  */}
      <section className="lg:col-span-1"></section>
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <Events />
      </section>
    </Container>
  );
}
