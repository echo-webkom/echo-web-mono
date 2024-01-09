import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

import { type FilteredHappeningQuery } from "@/components/events-view";
import { sanityFetch } from "../client";
import {
  allHappeningsQuery,
  happeningParamsQuery,
  happeningQuery,
  homeHappeningsQuery,
} from "./queries";
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
      image: T extends "bedpres" ? SanityImageSource : null;
      organizers: Array<string>;
    }>
  >({
    query: homeHappeningsQuery,
    params: {
      happeningTypes: types,
      n,
    },
    tags: ["home-happenings"],
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
  console.log(q);
  return await fetchAllHappenings().then((res) =>
    res
      .filter((happening) => {
        const { title } = happening;

        const search = q.search ?? "";

        return title.toLowerCase().includes(search.toLowerCase());
      })
      .filter((happening) => {
        const { happeningType } = happening;

        return happeningType === q.type || q.type === "all";
      })
      .filter((happening) => {
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

export async function fetchHappeningParams(types: Array<HappeningType>) {
  return await sanityFetch<Array<string>>({
    query: happeningParamsQuery,
    params: {
      happeningTypes: types,
    },
    tags: ["happening-params"],
  })
    .then((slugs) => slugs.map((slug) => ({ slug })))
    .catch(() => []);
}
