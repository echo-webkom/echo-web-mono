import {groq} from "next-sanity";
import {z} from "zod";

import {sanityClient} from "../client";
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

  const result = await sanityClient.fetch<Array<Minute>>(query);

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

  const result = await sanityClient.fetch<Array<{id: string}>>(query);

  return z
    .object({
      id: z.string(),
    })
    .array()
    .parse(result)
    .map((slug) => {
      return {
        params: {
          id: slug,
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

  const result = await sanityClient.fetch<Minute>(query, params);

  return minuteSchema.parse(result);
};
