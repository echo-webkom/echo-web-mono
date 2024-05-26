import { subMinutes } from "date-fns";
import { log } from "next-axiom";

import { type HappeningType } from "@echo-webkom/lib";

import { type DateInterval, type FilteredHappeningQuery } from "@/components/events-view";
import {
  type AllHappeningsQueryResult,
  type HappeningQueryResult,
  type HomeHappeningsQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "../client";
import { allHappeningsQuery, happeningQuery, homeHappeningsQuery } from "./queries";

/**
 * Fetches all happenings
 *
 * @returns all happenings
 */
export async function fetchAllHappenings() {
  return await sanityFetch<AllHappeningsQueryResult>({
    query: allHappeningsQuery,
    tags: ["happenings"],
  }).catch(() => {
    log.error("Failed to fetch all happenings");

    return [];
  });
}

/**
 * Fetches the upcoming happenings of a given type
 */
export async function fetchHomeHappenings(types: Array<HappeningType>, n: number) {
  return await sanityFetch<HomeHappeningsQueryResult>({
    query: homeHappeningsQuery,
    params: {
      happeningTypes: types,
      n,
    },
    cdn: true,
    revalidate: 1000,
  }).catch(() => {
    log.error("Failed to fetch home happenings");

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
  return await sanityFetch<HappeningQueryResult>({
    query: happeningQuery,
    tags: [`happening-${slug}`],
    params: {
      slug,
    },
  }).catch(() => {
    log.error("Failed to fetch happening by slug", {
      slug,
    });

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
): Promise<{ happenings: AllHappeningsQueryResult }> {
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
          organizers?.some((o) => o.name.toLowerCase().includes(search.toLowerCase()))
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
      log.error("Failed to fetch happening type by slug", {
        slug,
      });

      return null;
    });
}
