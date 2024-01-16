import { Suspense } from "react";

import { HappeningCalendar } from "@/components/calendar/happening-calendar";
import { Container } from "@/components/container";
import {
  EventFilter,
  EventFilterSidebar,
  FilterStatusAndOrderBar,
} from "@/components/event-filter";
import EventsView, { type SearchParams } from "@/components/events-view";
import { fetchAllHappenings } from "@/sanity/happening";

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const allHappenings = await fetchAllHappenings();
  if (!searchParams) searchParams = { type: "all" };

  // Serialize searchParams to a JSON string as a key for the Suspense component.
  // Ensure a stable key by stringifying a sorted object if the order may vary.
  const searchParamsKey = JSON.stringify(searchParams, Object.keys(searchParams).sort());

  return (
    <Container>
      <HappeningCalendar happenings={allHappenings} />
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
