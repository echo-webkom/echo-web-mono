import Container from "@/components/container";
import {HappeningPreviewBox} from "@/components/happening-preview-box";
import {Select} from "@/components/ui/select";
import {fetchUpcomingBedpresses} from "@/sanity/bedpres";
import {fetchComingEvents} from "@/sanity/event";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, bedpresses] = await Promise.all([
    fetchComingEvents(-1),
    fetchUpcomingBedpresses(-1),
  ]);

  // const sortByDate = () => {
  //   events.sort((a, b) => (new Date(a.date!) >= new Date(b.date!) ? 1 : -1));
  // };
  return (
    <Container className="grid grid-cols-1 gap-x-5 gap-y-12 px-3 lg:grid-cols-2">
      {/* Events  */}
      <section className="lg:col-span-2">
        <h2 className="text-center text-3xl font-bold">Arrangementer</h2>
        <form>
          <label htmlFor="sort">Sortér</label>
          <Select name="sort">
            <option value="name">Navn</option>
          </Select>
        </form>
      </section>
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <HappeningPreviewBox type="EVENT" happenings={events} />
      </section>

      {/* Bedpresses */}
      <section className="flex flex-col gap-5 rounded-md border p-5">
        <HappeningPreviewBox type="BEDPRES" happenings={bedpresses} />
      </section>
    </Container>
  );
}
