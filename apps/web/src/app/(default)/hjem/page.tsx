import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { Container } from "@/components/container";
import { ensureUser } from "@/lib/ensure";
import { Calendar } from "./_components/calendar";
import { ComingHappenings } from "./_components/coming-bedpres";
import { FilmklubbMovies } from "./_components/filmklubb";
import { HyggkomList } from "./_components/hyggkom-list";
import { JobAds } from "./_components/job-ads";
import { Posts } from "./_components/posts";

const VervBanner = () => {
  return (
    <a
      className="group mx-auto block w-full max-w-[1400px] px-6 text-black hover:underline"
      href="https://verv.echo-webkom.no"
    >
      <div className="rainbow flex items-center justify-between rounded-lg border-2 p-6 transition-all group-hover:shadow-lg">
        <FaArrowRight className="animate-bounce-right h-6 w-6" />
        <p className="text-center text-lg font-medium sm:text-3xl">Søk verv nå!</p>
        <FaArrowLeft className="animate-bounce-right h-6 w-6" />
      </div>
    </a>
  );
};

export default async function Home() {
  await ensureUser(undefined, {
    redirectTo: "/",
  });

  return (
    <div className="space-y-8 py-24">
      <VervBanner />

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
          n={7}
          className="col-span-1 row-span-2"
        />
        <ComingHappenings
          title="Kommende bedpres"
          href="/for-studenter/arrangementer"
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
