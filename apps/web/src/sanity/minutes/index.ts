import {groq} from "next-sanity";
import {z} from "zod";

import {serverFetch} from "../client";
import {minuteSchema, type Minute} from "./schema";

export * from "./schema";

/**
 * Get all meeting minutes.
 */
export const fetchMinutes = async () => {
  const query = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {
  _id,
  isAllMeeting,
  date,
  title,
  "document": document.asset->url
}
    `;

  const result = await serverFetch<Array<Minute>>(query);

  return minuteSchema.array().parse(result);
};

/**
 * Get all meeting minutes slugs.
 *
 * @returns
 */
export const fetchMinuteParams = async () => {
  const query = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] {
  "id": _id
}
    `;

  const result = await serverFetch<Array<{id: string}>>(query);

  // TODO: Make pretty
  return z
    .object({
      id: z.string(),
    })
    .array()
    .parse(result)
    .map(({id}) => {
      return {
        params: {
          id,
        },
      };
    });
};

export const fetchMinuteById = async (id: string) => {
  const query = groq`
*[_type == "meetingMinute" && _id == $id && !(_id in path('drafts.**'))] {
  _id,
  isAllMeeting,
  date,
  title,
  "document": document.asset->url
}[0]
    `;

  const params = {
    id,
  };

  const result = await serverFetch<Minute>(query, params);

  return minuteSchema.parse(result);
};
