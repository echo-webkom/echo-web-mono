import { nextMonday, subMinutes } from "date-fns";

import { type SearchParams } from "@/app/(default)/for-studenter/arrangementer/page";
import { fetchFilteredHappening } from "@/sanity/happening";
import { CombinedHappeningPreview } from "./happening-preview-box";

/**
 * This is a type definition for the query that is sent to Sanity.
 */
export type FilteredHappeningQuery = {
  search?: string;
  type: "all" | "event" | "bedpres";
  open: boolean;
  dateFilter?: Array<DateInterval>;
};

type DateInterval = {
  start?: Date;
  end?: Date;
};

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

// Sanitizes the query params before fetching data
function generateQuery(params: SearchParams) {
  const query: FilteredHappeningQuery = {
    search: params.search ?? undefined,
    type: (params.type as "event" | "bedpres" | "all") ?? "all",
    open: params.open === "true" ? true : false,
    dateFilter: getDateInterval(params),
  };

  return query;
}

export default async function EventsView({ params }: { params: SearchParams }) {
  const query = generateQuery(params);
  const happenings = await fetchFilteredHappening(query);

  if (!happenings) {
    return <div>Ingen arrangementer funnet</div>;
  }

  if (params.order === "ASC") happenings.reverse();

  return (
    <>
      <div>
        {happenings.map((event) => (
          <ul key={event._id} className="py-1">
            <CombinedHappeningPreview happening={event} />
          </ul>
        ))}
      </div>
    </>
  );
}
