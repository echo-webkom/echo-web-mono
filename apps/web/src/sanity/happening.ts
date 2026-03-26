import { subMinutes } from "date-fns";

import { type HappeningType } from "@echo-webkom/lib";

import { unoWithAdmin } from "@/api/server";
import { type DateInterval, type FilteredHappeningQuery } from "@/components/events-view";

/**
 * Fetches all happenings
 *
 * @returns all happenings
 */
export async function fetchAllHappenings() {
  return unoWithAdmin.sanity.happenings.all().catch(() => {
    console.error("Failed to fetch all happenings");

    return [];
  });
}

/**
 * Fetches the upcoming happenings of a given type
 */
export async function fetchHomeHappenings(types: Array<HappeningType>, n: number) {
  return unoWithAdmin.sanity.happenings
    .home({
      types,
      n,
    })
    .catch(() => {
      console.error("Failed to fetch home happenings");

      return [];
    });
}

/**
 * Fetches a happening by its slug
 *
 * @param slug the slug of the happening you want to fetch
 * @returns the happening or null if not found
 */
export const fetchHappeningBySlug = async (slug: string) => {
  return unoWithAdmin.sanity.happenings.bySlug(slug).catch(() => {
    console.error("Failed to fetch happening by slug", {
      slug,
    });

    return null;
  });
};

/**
 * Fetches happenings matching the query parameters
 *
 * @param q query parameters
 * @returns happenings matching the query parameters or an error message
 */
export const fetchFilteredHappening = async (
  q: FilteredHappeningQuery,
  dateFilter?: Array<DateInterval>,
): Promise<{ happenings: Awaited<ReturnType<typeof fetchAllHappenings>> }> => {
  const filteredHappenings = await fetchAllHappenings().then((res) =>
    res
      .filter((happening) => {
        const { date, endDate } = happening;

        if (!date) {
          return false;
        }

        if (!q.past && !dateFilter) return false;

        if (q.past) return new Date(endDate ?? date) < new Date();

        return new Date(endDate ?? date) >= subMinutes(new Date(), 5);
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
            const { date, endDate } = happening;

            if (!date) {
              return false;
            }

            return dateFilter.some((f) => {
              return (
                (f.start ?? f.end) &&
                (!f.start ||
                  new Date(date) >= f.start ||
                  (endDate && new Date(endDate) >= f.start)) &&
                (!f.end || new Date(date) < f.end)
              );
            });
          })
        : filteredHappenings,
  };
};
