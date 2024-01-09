import { sanityFetch } from "../client";
import { allMeetingMinuteQuery } from "./queries";
import { minuteSchema, type Minute } from "./schema";

/**
 * Get all meeting minutes.
 */
export async function fetchMinutes() {
  return await sanityFetch<Array<Minute>>({
    query: allMeetingMinuteQuery,
    tags: ["minutes"],
  })
    .then((res) => minuteSchema.array().parse(res))
    .catch(() => []);
}

/**
 * Get all meeting minutes ids.
 *
 * @returns
 */
export async function fetchMinuteParams() {
  return await fetchMinutes().then((res) =>
    res.map((minute) => ({
      id: minute._id,
    })),
  );
}

/**
 * Fetches a meeting minute by id.
 *
 * @param id the id of the meeting minute you want to fetch
 * @returns the meeting minute or null if not found
 */
export async function fetchMinuteById(id: string) {
  return await fetchMinutes().then((res) => res.find((minute) => minute._id === id));
}
