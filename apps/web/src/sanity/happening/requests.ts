import { type QueryParams } from "@/components/event-filter";
import { type ErrorMessage } from "@/utils/error";
import { sanityFetch } from "../client";
import { allHappeningsQuery } from "./queries";
import { happeningSchema, type Happening, type HappeningType } from "./schemas";

/**
 * Fetches all happenings
 *
 * @returns all happenings
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
export async function fetchUpcomingHappening(type: HappeningType, n: number) {
  return await fetchAllHappenings().then((happening) =>
    happening
      .filter(
        ({ happeningType, date }) => happeningType === type && date && new Date(date) > new Date(),
      )
      .sort((a, b) => {
        if (!a.date || !b.date) {
          return 0;
        }

        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, n),
  );
}

/**
 * Fetches a happening by its slug
 *
 * @param slug the slug of the happening you want to fetch
 * @returns the happening or null if not found
 */
export async function fetchHappeningBySlug(slug: string) {
  return await fetchAllHappenings().then((res) => res.find((happening) => happening.slug === slug));
}

/**
 * Fetches happenings matching the query parameters
 *
 * @param q query parameters
 * @returns happenings matching the query parameters or an error message
 */
export const fetchFilteredHappening = async (
  q: QueryParams,
): Promise<Array<Happening> | ErrorMessage> => {
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
        const { date } = happening;

        if (!date) {
          return false;
        }

        return q.past ? new Date(date) < new Date() : new Date(date) >= new Date();
      })
      .filter((happening) => {
        const { registrationStart, registrationEnd } = happening;

        if (!registrationStart || !registrationEnd) {
          return false;
        }

        return q.open
          ? new Date(registrationStart) <= new Date() && new Date(registrationEnd) > new Date()
          : true;
      }),
  );
};

/**
 * Gets the happening type of a happening by its slug
 *
 * @param slug the slug of the happening you want the type of
 * @returns the happening type or null if not found
 */
export async function getHappeningTypeBySlug(slug: string) {
  return await fetchHappeningBySlug(slug).then((happening) =>
    happening ? happening.happeningType : null,
  );
}

export async function fetchHappeningParams(types: Array<HappeningType>) {
  return await fetchAllHappenings().then((res) =>
    res
      .filter((happening) => types.includes(happening.happeningType))
      .map((happening) => ({
        slug: happening.slug,
      })),
  );
}
