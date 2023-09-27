import { groq } from "next-sanity";
import { z } from "zod";

import { sanityFetch } from "../client";
import { minuteSchema, type Minute } from "./schema";

export * from "./schema";

/**
 * Get all meeting minutes.
 */
export async function fetchMinutes() {
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
}

/**
 * Get all meeting minutes slugs.
 *
 * @returns
 */
export async function fetchMinuteParams() {
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
}

export async function fetchMinuteById(id: string) {
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
}
