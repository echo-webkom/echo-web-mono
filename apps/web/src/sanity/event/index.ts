import { groq } from "next-sanity";

import { type ErrorMessage } from "@/utils/error";
import { serverFetch } from "../client";
import { slugSchema, type Slug } from "../utils/slug";
import { eventSchema, type Event } from "./schemas";

export * from "./schemas";

export const fetchEventPaths = async () => {
  const query = groq`
*[_type == "event"
  && !(_id in path('drafts.**'))] {
  "slug": slug.current,
}
    `;

  const res = await serverFetch<Array<Slug>>(query);

  return slugSchema.array().parse(res);
};

/**
 * Fetch a preview of the coming events
 *
 * @param type Type of event to fetch
 * @param n Amount of events to fetch
 * @returns A list of event previews
 */
export const fetchComingEvents = async (n: number) => {
  const query = groq`
*[_type == "event"
  && !(_id in path('drafts.**'))
  && dates.date >= now()]
  | order(dates.date asc)
  [0...$n] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "organizers": organizer[]->{
    _id,
    name,
    "slug": slug.current,
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "date": dates.date,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minDegreeYear,
    maxDegreeYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  body
}
    `;

  const params = {
    n: n > 0 ? n : -1,
  };

  const res = await serverFetch<Array<Event>>(query, params);

  return eventSchema.array().parse(res);
};

export const fetchEventBySlug = async (slug: string) => {
  const query = groq`
*[_type == "event"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "organizers": organizer[]->{
    _id,
    name,
    "slug": slug.current,
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "date": dates.date,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minDegreeYear,
    maxDegreeYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  body
}[0]
    `;

  const params = {
    slug,
  };

  const res = await serverFetch<Event>(query, params);

  return eventSchema.parse(res);
};

export const $fetchAllEvents = async (): Promise<Array<Event> | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "event"
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "organizers": organizer[]->{
    _id,
    name,
    "slug": slug.current,
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "date": dates.date,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minDegreeYear,
    maxDegreeYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  body
}
    `;

    const res = await serverFetch<Array<Event>>(query);

    return eventSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch events",
    };
  }
};
