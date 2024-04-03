import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { subMinutes } from "date-fns";

import { type DateInterval, type FilteredHappeningQuery } from "@/components/events-view";
import { Logger } from "@/lib/logger";
import { sanityFetch } from "../client";
import { allHappeningsQuery, happeningQuery, homeHappeningsQuery } from "./queries";
import { happeningSchema, type Happening, type HappeningType } from "./schemas";

/**
 * Fetches all happenings
 *
 * @returns all happenings
 * @deprecated DO NOT USE
 */
export async function fetchAllHappenings() {
  return await sanityFetch<Array<Happening>>({
    query: allHappeningsQuery,
    tags: ["happenings"],
  })
    .then((res) => happeningSchema.array().parse(res))
    .catch(() => {
      Logger.error(fetchAllHappenings.name, "Failed to fetch all happenings");

      return [];
    });
}

/**
 * Fetches the upcoming happenings of a given type
 */
export async function fetchHomeHappenings<T extends HappeningType>(types: Array<T>, n: number) {
  return await sanityFetch<
    Array<{
      _id: string;
      title: string;
      happeningType: T;
      date: string;
      slug: string;
      registrationStart: string;
      image: T extends "bedpres" ? SanityImageSource : null;
      organizers: Array<string>;
    }>
  >({
    query: homeHappeningsQuery,
    params: {
      happeningTypes: types,
      n,
    },
    cdn: true,
    revalidate: 120,
  }).catch(() => {
    Logger.error(fetchHomeHappenings.name, "Failed to fetch home happenings");

    return [];
  });
}

/**
 * Fetches a happening by its slug
 *
 * @param slug the slug of the happening you want to fetch
 * @returns the happening or null if not found
 */
export async function fetchHappeningBySlug(slug: string) {
  return await sanityFetch<Happening>({
    query: happeningQuery,
    tags: [`happening-${slug}`],
    params: {
      slug,
    },
  }).catch(() => {
    Logger.error(fetchHappeningBySlug.name, `Failed to fetch happening with slug: ${slug}`);

    return null;
  });
}

/**
 * Fetches happenings matching the query parameters
 *
 * @param q query parameters
 * @returns happenings matching the query parameters or an error message
 */
export async function fetchFilteredHappening(
  q: FilteredHappeningQuery,
  dateFilter?: Array<DateInterval>,
) {
  const filteredHappenings = await fetchAllHappenings().then((res) =>
    res
      .filter((happening) => {
        const { date } = happening;

        if (!date) {
          return false;
        }

        if (!q.past && !dateFilter) return false;

        if (q.past) return new Date(date) < new Date();

        return new Date(date) >= subMinutes(new Date(), 5);
      })
      .filter((happening) => {
        const { happeningType } = happening;

        return happeningType === q.type || q.type === "all";
      })
      .filter((happening) => {
        const { registrationStart, registrationEnd } = happening;

        return q.open
          ? registrationStart &&
              registrationEnd &&
              new Date(registrationStart) <= new Date() &&
              new Date(registrationEnd) > new Date()
          : true;
      })
      .filter((happening) => {
        const { title, organizers } = happening;

        const search = q.search ?? "";

        return (
          title.toLowerCase().includes(search.toLowerCase()) ||
          organizers.some((o) => o.name.toLowerCase().includes(search.toLowerCase()))
        );
      }),
  );

  return {
    happenings:
      dateFilter && !q.past
        ? filteredHappenings.filter((happening) => {
            const { date } = happening;

            if (!date) {
              return false;
            }

            return dateFilter.some((f) => {
              return (
                (f.start ?? f.end) &&
                (!f.start || new Date(date) >= f.start) &&
                (!f.end || new Date(date) < f.end)
              );
            });
          })
        : filteredHappenings,
  };
}

/**
 * Gets the happening type of a happening by its slug
 *
 * @param slug the slug of the happening you want the type of
 * @returns the happening type or null if not found
 */
export async function getHappeningTypeBySlug(slug: string) {
  return await fetchHappeningBySlug(slug)
    .then((happening) => (happening ? happening.happeningType : null))
    .catch(() => {
      Logger.error(getHappeningTypeBySlug.name, `Failed to fetch happening type for slug: ${slug}`);

      return null;
    });
}
