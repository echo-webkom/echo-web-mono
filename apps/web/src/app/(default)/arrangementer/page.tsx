import Container from "@/components/container";
import Events from "@/components/event-filter";
import {$fetchAllBedpresses, type Bedpres} from "@/sanity/bedpres";
import {$fetchAllEvents} from "@/sanity/event";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, bedpresses] = await Promise.all([$fetchAllEvents(), $fetchAllBedpresses()]);

  const happenings = [];

  if (events instanceof Array<Event>) {
    const e = events.map((event) => ({...event, type: "EVENT" as const}));
    happenings.push(...e);
  }

  if (bedpresses instanceof Array<Bedpres>) {
    const b = bedpresses.map((bedpres) => ({...bedpres, type: "BEDPRES" as const}));
    happenings.push(...b);
  }

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
