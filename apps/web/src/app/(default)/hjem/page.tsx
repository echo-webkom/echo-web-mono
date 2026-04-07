import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { getCalendarEvents } from "@/lib/calendar-events";
import { ensureUser } from "@/lib/ensure";

import { Banner } from "./_components/banner";
import BirthdayBanner from "./_components/birthday-banner";
import { ComingHappenings } from "./_components/coming-bedpres";
import Cookies from "./_components/cookies-banner";
import EchoBirthdayBanner from "./_components/echo-birthday";
import { FilmklubbMovies } from "./_components/filmklubb";
import { FPCalendar } from "./_components/fp-calendar";
// import { HSApplications } from "./_components/hs-applications";
import { HyggkomList } from "./_components/hyggkom-list";
import { JobAds } from "./_components/job-ads";
import { Posts } from "./_components/posts";
import { WebathonBanner } from "./_components/webathon-banner";

export default async function Home() {
  await ensureUser();

  const [banner, calendarEvents, events, bedpres, posts, jobAds, movies, shoppingItems] =
    await Promise.all([
      unoWithAdmin.sanity.banner().catch(() => null),
      getCalendarEvents(),
      unoWithAdmin.sanity.happenings.home({ types: ["external", "event"], n: 11 }).catch(() => []),
      unoWithAdmin.sanity.happenings.home({ types: ["bedpres"], n: 3 }).catch(() => []),
      unoWithAdmin.sanity.posts.all({ n: 2 }).catch(() => []),
      unoWithAdmin.sanity.jobAds.all({ n: 4 }).catch(() => []),
      unoWithAdmin.sanity.movies.upcoming(3).catch(() => []),
      unoWithAdmin.shopping.items().catch(() => []),
    ]);

  const allHappeningIds = [...events, ...bedpres].map((h) => h._id);
  const registrationCounts = await unoWithAdmin.happenings.registrationCount(allHappeningIds);

  return (
    <>
      <Cookies />
      <Banner banner={banner} />
      <BirthdayBanner />
      <EchoBirthdayBanner />

      <div className="space-y-8 py-10">
        <Container layout="larger">
          <FPCalendar calendarEvents={calendarEvents} />
        </Container>

        {/* <Container layout="larger">
          <HSApplications />
        </Container> */}

        <Container
          layout="larger"
          className="space-y-8 md:grid md:grid-cols-3 md:grid-rows-2 md:gap-8 md:space-y-0"
        >
          <ComingHappenings
            title="Arrangementer"
            href="/for-studenter/arrangementer?type=event"
            happenings={events}
            registrationCounts={registrationCounts}
            className="col-span-1 row-span-2"
          />
          <ComingHappenings
            title="Bedriftpresentasjoner"
            href="/for-studenter/arrangementer?type=bedpres"
            happenings={bedpres}
            registrationCounts={registrationCounts}
            className="col-span-2 row-span-1"
          />
          <Posts posts={posts} className="col-span-2 row-span-1" />
        </Container>

        <Container layout="larger">
          <JobAds jobAds={jobAds} />
        </Container>

        <Container
          layout="larger"
          className="space-y-8 md:grid md:grid-cols-3 md:gap-8 md:space-y-0"
        >
          <FilmklubbMovies movies={movies} className="col-span-1" />
          <HyggkomList items={shoppingItems} className="col-span-2" />
        </Container>
      </div>
    </>
  );
}
