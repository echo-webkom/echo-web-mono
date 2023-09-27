import { groq } from "next-sanity";

import { sanityFetch } from "../client";
import { slugSchema, type Slug } from "../utils/slug";
import { eventSchema, type Event } from "./schemas";

export * from "./schemas";

export async function fetchEventPaths() {
  const query = groq`
*[_type == "event"
  && !(_id in path('drafts.**'))] {
  "slug": slug.current,
}
    `;

  const res = await sanityFetch<Array<Slug>>({
    query,
    tags: ["event-paths"],
  });

  return slugSchema.array().parse(res);
}

/**
 * Fetch a preview of the coming events
 *
 * @param type Type of event to fetch
 * @param n Amount of events to fetch
 * @returns A list of event previews
 */
export async function fetchComingEvents(n: number) {
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

  const res = await sanityFetch<Array<Event>>({
    query,
    params,
    tags: ["coming-events"],
  });

  return eventSchema.array().parse(res);
}

export async function fetchEventBySlug(slug: string) {
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

  const res = await sanityFetch<Event | null>({
    query,
    params,
    tags: [`event-${slug}`],
  });

  if (!res) {
    return null;
  }

  return eventSchema.parse(res);
}

export async function $fetchAllEvents() {
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

    const res = await sanityFetch<Array<Event>>({
      query,
      tags: ["all-events"],
    });

    return eventSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch events",
    };
  }
}
