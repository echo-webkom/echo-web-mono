import { nextMonday, subMinutes } from "date-fns";

import { Container } from "@/components/container";
import {
  EventFilter,
  EventFilterSidebar,
  FilterStatusAndOrderBar,
} from "@/components/event-filter";
import EventsView from "@/components/events-view";
import { Callout } from "@/components/typography/callout";
import { fetchFilteredHappening } from "@/sanity/happening/requests";

/**
 * This is a type definition for the query that is sent to Sanity.
 */
export type FilteredHappeningQuery = {
  search?: string;
  type: "all" | "event" | "bedpres";
  open: boolean;
  past: boolean;
  dateFilter?: Array<DateInterval>;
};

type DateInterval = {
  start?: Date;
  end?: Date;
};

type SearchParams = {
  type?: string;
  order?: string;
  search?: string;
  open?: string;
  past?: string;
  thisWeek?: string;
  nextWeek?: string;
  later?: string;
};

/**
 * Sanitizes the SearchParams before fetching data
 */
function createFilteredHappeningQuery(params: SearchParams | undefined) {
  if (!params) params = { type: "all" };

  return {
    search: params.search ?? undefined,
    type: (params.type as "event" | "bedpres") ?? "all",
    open: params.open === "true" ? true : false,
    past: params.past === "true" ? true : false,
    dateFilter: getDateIntervals(params),
  };
}

/**
 * This function creates an array of DateIntervals.
 * Will be useful in the future to allow the user to enter custom dates.
 */
function getDateIntervals(params: SearchParams) {
  const currentDate = new Date();

  const past = params.past === "true" ? true : false;
  const hideThisWeek = params.thisWeek === "false" ? true : false;
  const hideNextWeek = params.nextWeek === "false" ? true : false;
  const hideLater = params.later === "false" ? true : false;

  if (past) {
    return [{ end: currentDate }];
  }
  if (!hideThisWeek && !hideNextWeek && !hideLater) return [{ start: subMinutes(currentDate, 30) }];
  if (hideThisWeek && !hideNextWeek && !hideLater) return [{ start: nextMonday(currentDate) }];
  if (!hideThisWeek && hideNextWeek && !hideLater)
    return [
      { start: subMinutes(currentDate, 30), end: nextMonday(currentDate) },
      { start: nextMonday(nextMonday(currentDate)) },
    ];
  if (!hideThisWeek && !hideNextWeek && hideLater)
    return [{ start: subMinutes(currentDate, 30), end: nextMonday(nextMonday(currentDate)) }];
  if (!hideThisWeek && hideNextWeek && hideLater)
    return [{ start: subMinutes(currentDate, 30), end: nextMonday(currentDate) }];
  if (hideThisWeek && !hideNextWeek && hideLater)
    return [{ start: nextMonday(currentDate), end: nextMonday(nextMonday(currentDate)) }];
  if (hideThisWeek && hideNextWeek && !hideLater)
    return [{ start: nextMonday(nextMonday(currentDate)) }];

  return undefined;
}

export default async function Page({ searchParams }: { searchParams?: SearchParams }) {
  const query: FilteredHappeningQuery = createFilteredHappeningQuery(searchParams);
  const { numThisWeek, numNextWeek, numLater, happenings } = await fetchFilteredHappening(query);

  if (!happenings)
    return (
      <Callout type="danger" className="mx-auto my-8 w-full max-w-lg">
        <p className="font-bold">En feil har oppstått...</p>
        <p>Ta kontakt med Webkom</p>
      </Callout>
    );

  if (searchParams?.order === "ASC") happenings.reverse();

  return (
    <Container>
<<<<<<< HEAD
      <div className="pb-4 sm:mb-8 sm:border-b-2">
        <EventFilter />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="mb-5 w-full sm:mb-0 sm:max-w-[250px] sm:pr-14">
          <EventFilterSidebar numOfEvents={{ numThisWeek, numNextWeek, numLater }} />
        </div>
        <div className="w-full space-y-2">
          <FilterStatusAndOrderBar />
=======
      <EventFilter />
      <div className="flex flex-row">
        <div className="h-full w-full pr-16 md:sticky md:top-24 md:max-w-[250px]">
          <EventFilterSidebar numOfEvents={{ numThisWeek, numNextWeek, numLater }} />
        </div>
        <div className="w-[calc(100%-250px)]">
>>>>>>> 2398aecf (EchoGram class)
          <EventsView happenings={happenings} />
        </div>
      </div>
    </Container>
  );
}
