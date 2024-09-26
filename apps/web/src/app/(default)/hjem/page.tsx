import { Container } from "@/components/container";
import { ensureUser } from "@/lib/ensure";
import { ComingHappenings } from "./_components/coming-bedpres";
import { FilmklubbMovies } from "./_components/filmklubb";
import { FPCalendar } from "./_components/fp-calendar";
import { HyggkomList } from "./_components/hyggkom-list";
import { JobAds } from "./_components/job-ads";
import { Posts } from "./_components/posts";

export default async function Home() {
  await ensureUser();

  return (
    <div className="space-y-8 py-24">
      <Container layout="larger">
        <FPCalendar />
      </Container>

      <Container
        layout="larger"
        className="flex space-y-8 md:grid md:grid-cols-3 md:grid-rows-2 md:gap-8 md:space-y-0"
      >
        <ComingHappenings
          title="Arrangementer"
          href="/for-studenter/arrangementer?type=event"
          types={["external", "event"]}
          n={11}
          className="col-span-1 row-span-2"
        />
        <ComingHappenings
          title="Bedriftspresentasjoner"
          href="/for-studenter/arrangementer?type=bedpres"
          types={["bedpres"]}
          n={3}
          className="col-span-2 row-span-1"
        />
        <Posts className="col-span-2 row-span-1" />
      </Container>

      <Container layout="larger">
        <JobAds className="col-span-2 row-span-1" />
      </Container>

      <Container layout="larger" className="space-y-8 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
        <FilmklubbMovies className="col-span-1" />
        <HyggkomList className="col-span-2" />
      </Container>
    </div>
  );
}
