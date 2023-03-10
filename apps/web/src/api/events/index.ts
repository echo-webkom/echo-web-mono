import { groq } from "next-sanity";
import { sanityClient } from "../sanity.client";
import {
  EventType,
  EventPreview,
  eventPreviewSchema,
  eventSchema,
  Event,
} from "./schemas";

export * from "./schemas";

/**
 * Fetch a preview of the latest events
 * TODO: Add support for fetching all types
 *
 * @param type Type of event to fetch
 * @param n Amount of events to fetch
 * @returns A list of event previews
 */
export const fetchEventPreviews = async (
  type: EventType,
  n: number
): Promise<Array<EventPreview>> => {
  try {
    const query = groq`
      *[_type == "happening"
        && happeningType == $type
        && !(_id in path('drafts.**'))]
        | order(date desc) {
          _id,
          _createdAt,
          title,
          "slug": slug.current,
          body,
          date,
          registrationDate,
          logoUrl,
          happeningType,
          spotRanges[] -> {
            minDegreeYear,
            maxDegreeYear,
            spots
          }
      }[0...$n]
    `;

    const params = {
      type,
      n,
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
