import { Container } from "@/components/container";
import Events from "@/components/event-filter";
import { $fetchAllBedpresses } from "@/sanity/bedpres";
import { $fetchAllEvents } from "@/sanity/event";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, bedpresses] = await Promise.all([$fetchAllEvents(), $fetchAllBedpresses()]);

  const happenings = [
    ...events.map((event) => ({ ...event, type: "EVENT" as const })),
    ...bedpresses.map((bedpres) => ({ ...bedpres, type: "BEDPRES" as const })),
  ];

  return (
    <Container className="grid grid-cols-1 gap-x-5 gap-y-12 px-3">
      {/* Events  */}
      <section className="lg:col-span-2">
        <h2 className="text-center text-3xl font-bold">Arrangementer</h2>
      </section>
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <Events events={happenings} />
      </section>
    </Container>
  );
}
