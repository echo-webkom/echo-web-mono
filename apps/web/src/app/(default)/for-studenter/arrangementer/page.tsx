import { Suspense } from "react";
import removeMarkdown from "remove-markdown";

import { Calendar } from "@/components/calendar/happening-calendar";
import { Container } from "@/components/container";
import {
  EventFilter,
  EventFilterSidebar,
  FilterStatusAndOrderBar,
} from "@/components/event-filter";
import EventsView, { type SearchParams } from "@/components/events-view";
import { createHappeningLink } from "@/lib/create-link";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const [happenngs, movies] = await Promise.all([fetchAllHappenings(), fetchMovies()]);
  if (!searchParams) searchParams = { type: "all" };

  // Serialize searchParams to a JSON string as a key for the Suspense component.
  // Ensure a stable key by stringifying a sorted object if the order may vary.
  const searchParamsKey = JSON.stringify(searchParams, Object.keys(searchParams).sort());

  const mappedHappenings = happenngs
    .filter((happening) => Boolean(happening.date))
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date!),
      body: removeMarkdown(happening.body ?? ""),
      link: createHappeningLink(happening),
      happeningType: happening.happeningType,
    }));

  const mappedMovies = movies.map((movie) => ({
    id: movie._id,
    title: `Film: ${movie.title}`,
    date: new Date(movie.date),
    body: `Se ${movie.title} med filmklubben!`,
    link: movie.link,
    happeningType: "external",
  }));

  return (
    <Container className="space-y-4 py-10">
      <Calendar events={mappedHappenings.concat(mappedMovies)} />
      <div className="pb-4 sm:mb-8 sm:border-b-2">
        <EventFilter />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="mb-5 w-full sm:mb-0 sm:max-w-[250px] sm:pr-14">
          <EventFilterSidebar />
        </div>
        <div className="w-full space-y-2">
          <FilterStatusAndOrderBar />
          <Suspense key={searchParamsKey} fallback={<></>}>
            <EventsView searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
