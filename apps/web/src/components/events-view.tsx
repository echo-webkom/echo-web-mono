import Image from "next/image";
import { subMinutes } from "date-fns";

import { fetchFilteredHappening } from "@/sanity/happening";
import { startOfNextWeek, startOfTheWeekAfterNext } from "@/utils/date";
import { CombinedHappeningPreview } from "./happening-preview-box";
import { Callout } from "./typography/callout";

/**
 * This is a type definition for the query that is sent to Sanity.
 */
export type FilteredHappeningQuery = {
  search?: string;
  type: "all" | "event" | "bedpres";
  open: boolean;
  past: boolean;
};

export type DateInterval = {
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

/**
 * Sanitizes the SearchParams before fetching data
 */
function createFilteredHappeningQuery(params: SearchParams) {
  return {
    search: params.search ?? undefined,
    type: (params.type as "event" | "bedpres") ?? "all",
    open: params.open === "true" ? true : false,
    past: params.past === "true" ? true : false,
  };
}

/**
 * This function creates an array of DateIntervals.
 * Will be useful in the future to allow the user to enter custom dates.
 */
function getDateIntervals(params: SearchParams) {
  const currentDate = new Date();

  const hideThisWeek = params.thisWeek === "false" ? true : false;
  const hideNextWeek = params.nextWeek === "false" ? true : false;
  const hideLater = params.later === "false" ? true : false;

  if (!hideThisWeek && !hideNextWeek && !hideLater) return [{ start: subMinutes(currentDate, 5) }];
  if (hideThisWeek && !hideNextWeek && !hideLater) return [{ start: startOfNextWeek(currentDate) }];
  if (!hideThisWeek && hideNextWeek && !hideLater)
    return [
      { start: subMinutes(currentDate, 5), end: startOfNextWeek(currentDate) },
      { start: startOfTheWeekAfterNext(currentDate) },
    ];
  if (!hideThisWeek && !hideNextWeek && hideLater)
    return [{ start: subMinutes(currentDate, 5), end: startOfTheWeekAfterNext(currentDate) }];
  if (!hideThisWeek && hideNextWeek && hideLater)
    return [{ start: subMinutes(currentDate, 5), end: startOfNextWeek(currentDate) }];
  if (hideThisWeek && !hideNextWeek && hideLater)
    return [
      {
        start: startOfNextWeek(currentDate),
        end: startOfTheWeekAfterNext(currentDate),
      },
    ];
  if (hideThisWeek && hideNextWeek && !hideLater)
    return [{ start: startOfTheWeekAfterNext(currentDate) }];

  return undefined;
}

export default async function EventsView({ searchParams }: { searchParams: SearchParams }) {
  const query: FilteredHappeningQuery = createFilteredHappeningQuery(searchParams);

  const { happenings } = await fetchFilteredHappening(query, getDateIntervals(searchParams));

  if (!happenings)
    return (
      <Callout type="danger" className="mx-auto my-8 w-full max-w-lg">
        <p className="font-bold">En feil har oppstått...</p>
        <p>Ta kontakt med Webkom</p>
      </Callout>
    );

  if (searchParams?.order === "DESC") happenings.reverse();

  if (happenings.length === 0) {
    return (
      <div className="m-5 flex flex-col">
        <h3 className="mx-auto text-xl font-medium">Her var det tomt!</h3>
        <h3 className="mx-auto font-medium">Prøv å oppdatere filtrene.</h3>
        <Image
          className="m-5 mx-auto rounded-lg"
          src="/gif/fresh-prince-room.gif"
          alt="Fresh prince empty room"
          width={400}
          height={400}
        />
      </div>
    );
  }

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
