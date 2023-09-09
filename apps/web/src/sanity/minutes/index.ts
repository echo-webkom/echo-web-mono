import { groq } from "next-sanity";
import { z } from "zod";

import { sanityFetch } from "../client";
import { minuteSchema, type Minute } from "./schema";

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

  const result = await sanityFetch<Array<Minute>>({
    query,
    tags: ["minutes"],
  });

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

  const result = await sanityFetch<Array<{ id: string }>>({
    query,
    tags: ["minute-params"],
  });

  // TODO: Make pretty
  return z
    .object({
      id: z.string(),
    })
    .array()
    .parse(result)
    .map(({ id }) => ({
      id,
    }));
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

  const result = await sanityFetch<Minute>({
    query,
    params,
    tags: ["minute"],
  });

  return minuteSchema.parse(result);
};
