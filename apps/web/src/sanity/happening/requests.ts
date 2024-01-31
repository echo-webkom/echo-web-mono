import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { nextMonday, subMinutes } from "date-fns";

import { type FilteredHappeningQuery } from "@/app/(default)/for-studenter/arrangementer/page";
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
    .catch(() => []);
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
    revalidate: 120,
  }).catch(() => []);
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
  }).catch(() => null);
}

/**
 * Fetches happenings matching the query parameters
 *
 * @param q query parameters
 * @returns happenings matching the query parameters or an error message
 */
export async function fetchFilteredHappening(q: FilteredHappeningQuery) {
  const filteredHappenings = await fetchAllHappenings().then((res) =>
    res
      .filter((happening) => {
        const { title, organizers } = happening;

        const search = q.search ?? "";

        return (
          title.toLowerCase().includes(search.toLowerCase()) ||
          organizers.some((o) => o.name.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .filter((happening) => {
        const { happeningType } = happening;

        return happeningType === q.type || q.type === "all";
      })
      .filter((happening) => {
        const { date } = happening;

        if (!date) {
          return false;
        }

        if (q.past) return new Date(date) < new Date();

        return new Date(date) >= subMinutes(new Date(), 30);
      })
      .filter((happening) => {
        const { registrationStart, registrationEnd } = happening;

        return q.open
          ? registrationStart &&
              registrationEnd &&
              new Date(registrationStart) <= new Date() &&
              new Date(registrationEnd) > new Date()
          : true;
      }),
  );

  const { numThisWeek, numNextWeek, numLater } = filteredHappenings.reduce(
    (acc: { numThisWeek: number; numNextWeek: number; numLater: number }, happening) => {
      const { date } = happening;

      if (!date) {
        return acc;
      }

      const happeningDate = new Date(date);

      const thisWeek = subMinutes(new Date(), 30);
      const nextWeek = nextMonday(thisWeek);
      const later = nextMonday(nextWeek);

      if (happeningDate >= thisWeek && happeningDate < nextWeek) {
        acc.numThisWeek += 1;
      } else if (happeningDate >= nextWeek && happeningDate < later) {
        acc.numNextWeek += 1;
      } else if (happeningDate >= later) {
        acc.numLater += 1;
      }

      return acc;
    },
    { numThisWeek: 0, numNextWeek: 0, numLater: 0 },
  );

  return {
    numThisWeek,
    numNextWeek,
    numLater,
    happenings: q.past
      ? filteredHappenings
      : filteredHappenings.filter((happening) => {
          if (!q.dateFilter) {
            return false;
          }

          const { date } = happening;

          if (!date) {
            return false;
          }

          return q.dateFilter.some((f) => {
            return (
              (f.start ?? f.end) &&
              (!f.start || new Date(date) >= f.start) &&
              (!f.end || new Date(date) < f.end)
            );
          });
        }),
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
    .catch(() => null);
}
