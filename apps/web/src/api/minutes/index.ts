import {type ErrorMessage} from "@/utils/error";
import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {minuteSchema, type Minute} from "./schema";

export * from "./schema";

/**
 * Get all meeting minutes.
 */
export const fetchMinutes = async (): Promise<Array<Minute> | ErrorMessage> => {
  try {
    const query = groq`
                *[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {
                    allmote,
                    date,
                    title,
                    document {
                        asset -> {
                            url
                        }
                    }
                }`;

    const result = await sanityClient.fetch<Array<Minute>>(query);

    return minuteSchema.array().parse(result);
  } catch (error) {
    console.log(error); // eslint-disable-line
    return {message: JSON.stringify(error)};
  }
};
