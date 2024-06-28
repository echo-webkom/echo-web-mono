import { redirect } from "next/navigation";

import { auth } from "@echo-webkom/auth";

import { Container } from "@/components/container";
import { Calendar } from "./_components/calendar";
import { ComingHappenings } from "./_components/coming-bedpres";
import { FilmklubbMovies } from "./_components/filmklubb";
import { HyggkomList } from "./_components/hyggkom-list";
import { JobAds } from "./_components/job-ads";
import { Posts } from "./_components/posts";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="space-y-8 py-24">
      <Container layout="larger">
        <Calendar />
      </Container>

      <Container
        layout="larger"
        className="flex space-y-8 md:grid md:grid-cols-3 md:grid-rows-2 md:gap-8 md:space-y-0"
      >
        <ComingHappenings
          title="Kommende arrangementer"
          href="/for-studenter/arrangementer"
          types={["external", "event"]}
          n={5}
          className="col-span-1 row-span-2"
        />
        <ComingHappenings
          title="Kommende bedpres"
          href="/for-studenter/bedpres"
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
