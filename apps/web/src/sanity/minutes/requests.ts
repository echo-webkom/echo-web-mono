import { sanityFetch } from "../client";
import { allMeetingMinuteQuery, meetingMinuteByIdQuery, meetingMinuteIdsQuery } from "./queries";
import { idSchema, minuteSchema, type Minute } from "./schema";

/**
 * Get all meeting minutes.
 */
export async function fetchMinutes() {
  try {
    return await sanityFetch<Array<Minute>>({
      query: allMeetingMinuteQuery,
      tags: ["minutes"],
    }).then((res) => minuteSchema.array().parse(res));
  } catch {
    return [];
  }
}

/**
 * Get all meeting minutes ids.
 *
 * @returns
 */
export async function fetchMinuteParams() {
  try {
    return await sanityFetch({
      query: meetingMinuteIdsQuery,
      tags: ["minute-params"],
    }).then((res) =>
      idSchema
        .array()
        .parse(res)
        .map(({ id }) => id),
    );
  } catch {
    return [];
  }
}

/**
 * Fetches a meeting minute by id.
 *
 * @param id the id of the meeting minute you want to fetch
 * @returns the meeting minute or null if not found
 */
export async function fetchMinuteById(id: string) {
  try {
    return await sanityFetch<Minute>({
      query: meetingMinuteByIdQuery,
      params: {
        id,
      },
      tags: ["minute"],
    }).then((res) => minuteSchema.parse(res));
  } catch {
    return null;
  }
}
