import { nextMonday, subMinutes } from "date-fns";

import { Container } from "@/components/container";
import { EventFilter, EventFilterSidebar } from "@/components/event-filter";
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

export type SearchParams = {
  type?: string;
  order?: string;
  search?: string;
  open?: string;
  past?: string;
  thisWeek?: string;
  nextWeek?: string;
  later?: string;
};

// Sanitizes the query params before fetching data
function generateQuery(params: SearchParams) {
  const query: FilteredHappeningQuery = {
    search: params.search ?? undefined,
    type: (params.type as "event" | "bedpres") ?? "all",
    open: params.open === "true" ? true : false,
    past: params.past === "true" ? true : false,
    dateFilter: getDateInterval(params),
  };

  return query;
}

function validateParams(params: SearchParams | undefined) {
  if (!params) return { type: "all" };

  const validParams: SearchParams = {
    type: (params.type as "event" | "bedpres") ?? undefined,
    order: params.order === "ASC" ? "ASC" : undefined,
    search: params.search ?? undefined,
    thisWeek: params.thisWeek === "false" ? "false" : undefined,
    nextWeek: params.nextWeek === "false" ? "false" : undefined,
    later: params.later === "false" ? "false" : undefined,
    open: params.open === "true" ? "true" : undefined,
    past: params.past === "true" ? "true" : undefined,
  };

  return validParams;
}

function getDateInterval(params: SearchParams) {
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
  const validParams = validateParams(searchParams);

  const query = generateQuery(validParams);
  const { numThisWeek, numNextWeek, numLater, happenings } = await fetchFilteredHappening(query);

  if (!happenings)
    return (
      <Callout type="danger" className="mx-auto my-8 w-full max-w-lg">
        <p className="font-bold">En feil har oppstått...</p>
        <p>Ta kontakt med Webkom</p>
      </Callout>
    );

  if (validParams.order === "ASC") happenings.reverse();

  return (
    <Container>
      <div>
        <EventFilter params={validParams} />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:max-w-[250px]">
          <EventFilterSidebar
            params={validParams}
            numOfEvents={{ numThisWeek, numNextWeek, numLater }}
          />
        </div>
        <div className="w-full">
          <EventsView happenings={happenings} />
        </div>
      </div>
    </Container>
  );
}
