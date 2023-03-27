import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {
  eventPreviewSchema,
  eventSchema,
  type Event,
  type EventPreview,
  type EventType,
} from "./schemas";

export * from "./schemas";

/**
 * Fetch a preview of the coming events
 *
 * @param type Type of event to fetch
 * @param n Amount of events to fetch
 * @returns A list of event previews
 */
export const fetchComingEventPreviews = async (
  type: EventType,
  n: number,
): Promise<Array<EventPreview>> => {
  try {
    const query = groq`
      *[_type == "happening"
        && happeningType == $type
        && !(_id in path('drafts.**'))
        && date >= now()]
        | order(date asc)
        [0..$n] {
          _id,
          _createdAt,
          title,
          "slug": slug.current,
          body,
          date,
          registrationDate,
          studentGroupName,
          "logoUrl": logo.asset -> url,
          happeningType,
          spotRanges[] -> {
            minDegreeYear,
            maxDegreeYear,
            spots
          }
      }
    `;

    const params = {
      type,
      n: n > 0 ? n : -1,
    };

    const res = await sanityClient.fetch<Array<EventPreview>>(query, params);

    return eventPreviewSchema.array().parse(res);
  } catch {
    return [];
  }
};

/**
 * Fetches an event by its slug
 *
 * @param slug The slug of the event
 * @returns An event
 */
export const fetchEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const query = groq`
      *[_type == "happening"
        && slug.current == $slug
        && !(_id in path('drafts.**'))
      ] {
          _createdAt,
          studentGroupName,
          title,
          "slug": slug.current,
          date,
          registrationDate,
          registrationDeadline,
          studentGroupRegistrationDate,
          studentGroups,
          onlyForStudentGroups,
          body,
          deductiblePayment,
          location,
          locationLink,
          companyLink,
          "logoUrl": logo.asset -> url,
          contactEmail,
          additionalQuestions[] -> {
            questionText,
            inputType,
            alternatives
          },
          spotRanges[] -> {
            minDegreeYear,
            maxDegreeYear,
            spots,
          },
          happeningType,
        }[0]
    `;

    const params = {
      slug,
    };

    const res = await sanityClient.fetch<Event>(query, params);

    return eventSchema.parse(res);
  } catch {
    return null;
  }
};
