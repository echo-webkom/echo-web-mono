import { groq } from "next-sanity";

import { type QueryParams } from "@/components/event-filter";
import { type ErrorMessage } from "@/utils/error";
import { sanityClient, sanityFetch } from "../client";
import {
  happeningBySlugQuery,
  happeningPartial,
  happeningTypeBySlugQuery,
  upcomingHappeningQuery,
} from "./queries";
import {
  happeningSchema,
  happeningTypeSchema,
  type Happening,
  type HappeningType,
} from "./schemas";

/**
 * Fetches the upcoming happenings of a given type
 *
 * @param type type of happenings
 * @param n number of happenings to fetch. -1 for all
 * @returns upcoming happenings
 */
export async function fetchUpcomingHappening(type: HappeningType, n: number) {
  try {
    return await sanityFetch<Array<Happening>>({
      query: upcomingHappeningQuery,
      params: {
        n: n > 0 ? n : -1,
        type,
      },
      tags: ["upcoming-happenings"],
    }).then((res) => happeningSchema.array().parse(res));
  } catch (error) {
    return null;
  }
}

/**
 * Fetches a happening by its slug
 *
 * @param slug the slug of the happening you want to fetch
 * @returns the happening or null if not found
 */
export async function fetchHappeningBySlug(slug: string) {
  try {
    return await sanityFetch<Happening>({
      query: happeningBySlugQuery,
      params: {
        slug,
      },
      tags: [`happening-${slug}`],
    }).then((res) => happeningSchema.parse(res));
  } catch (error) {
    return null;
  }
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
  const conditions = [
    `_type == "happening"`,
    `!(_id in path('drafts.**'))`,
    q.type === "all" ? null : `happeningType == "${q.type}"`,
    q.open ? `registrationStart <= now() && registrationEnd > now()` : null,
    q.past ? `date < now()` : `date >= now()`,
    q.search ? `title match "*${q.search}*"` : null,
  ].filter(Boolean);

  const query = groq`
*[${conditions.join(" && ")}] {
  ${happeningPartial}
}
`;

  try {
    return await sanityClient.fetch(query).then((res) => happeningSchema.array().parse(res));
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch happening.",
    };
  }
};

/**
 * Gets the happening type of a happening by its slug
 *
 * @param slug the slug of the happening you want the type of
 * @returns the happening type or null if not found
 */
export async function getHappeningTypeBySlug(slug: string) {
  try {
    return await sanityFetch<string>({
      query: happeningTypeBySlugQuery,
      params: {
        slug,
      },
      tags: [`happening-${slug}`],
    }).then((res) => happeningTypeSchema.parse(res));
  } catch {
    return null;
  }
}
