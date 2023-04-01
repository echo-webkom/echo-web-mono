import {type ErrorMessage} from "@/utils/error";
import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {slugSchema, type Slug} from "../utils/slug";
import {minuteSchema, type Minute} from "./schema";

export * from "./schema";

/**
 * Get all meeting minutes.
 */
export const fetchMinutes = async (): Promise<Array<Minute> | ErrorMessage> => {
  try {
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
  } catch (error) {
    console.log(error); // eslint-disable-line
    return {message: JSON.stringify(error)};
  }
};

export const fetchMinutesPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] {
  "slug": _id
}
    `;

    const result = await sanityClient.fetch<Array<Slug>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

export const fetchMinuteBySlug = async (slug: string): Promise<Minute | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "meetingMinute" && _id == $slug && !(_id in path('drafts.**'))] {
  _id,
  isAllMeeting,
  date,
  title,
  "document": document.asset->url
}[0]
    `;

    const params = {
      slug,
    };

    const result = await sanityClient.fetch<Minute>(query, params);

    return minuteSchema.parse(result);
  } catch (error) {
    return {message: JSON.stringify(error)};
  }
};
