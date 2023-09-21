import { groq } from "next-sanity";

import { type SearchParams } from "@/components/event-filter";
import { type ErrorMessage } from "@/utils/error";
import { sanityFetch } from "../client";
import { bedpresSchema, type Bedpres } from "./schemas";

export * from "./schemas";

export const fetchUpcomingBedpresses = async (n: number) => {
  const query = groq`
*[_type == "bedpres"
  && !(_id in path('drafts.**'))
  && dates.date >= now()]
  | order(date asc)
  [0...$n] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
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

  const res = await sanityFetch<Array<Bedpres>>({
    query,
    params,
    tags: ["upcoming-bedpresses"],
  });

  return bedpresSchema.array().parse(res);
};

export const fetchBedpresBySlug = async (slug: string) => {
  const query = groq`
*[_type == "bedpres"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
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
  "body": body {
    no,
    en,
  }
}[0]
    `;

  const params = {
    slug,
  };

  const res = await sanityFetch<Bedpres>({
    query,
    params,
    tags: [`bedpres-${slug}`],
  });

  return bedpresSchema.parse(res);
};

export const $fetchAllBedpresses = async (): Promise<Array<Bedpres> | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "bedpres"
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
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
  "body": body {
    no,
    en,
  }
}
    `;

    const res = await sanityFetch<Bedpres>({
      query,
      tags: ["all-bedpresses"],
    });

    return bedpresSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
};

export const fetchFilteredBedpresses = async (q: SearchParams) => {
  const conditions = [
    `_type == "event"`,
    `!(_id in path('drafts.**'))`,
    q.open ? `dates.registrationStart <= now() && dates.registrationEnd > now()` : null,
    q.past ? `dates.date < now()` : null,
    q.thisWeek && !q.nextWeek && !q.later ? `dates.date >= now() && dates.date < now() + 7d` : null,
    !q.thisWeek && q.nextWeek && !q.later
      ? `dates.date >= now() + 7d && dates.date < now() + 14d`
      : null,
    !q.thisWeek && !q.nextWeek && q.later ? `dates.date >= now() + 14d` : null,
    q.thisWeek && q.nextWeek && !q.later ? `dates.date >= now() && dates.date < now() + 14d` : null,
    q.thisWeek && !q.nextWeek && q.later
      ? `(dates.date >= now() && dates.date < now() + 7d) || (dates.date >= now() + 14d)`
      : null,
    !q.thisWeek && q.nextWeek && q.later ? `dates.date >= now() + 7d` : null,
    q.thisWeek && q.nextWeek && q.later ? `dates.date >= now()` : null,
    q.search ? `title match ${q.search}` : null,
  ].filter(Boolean);

  try {
    const query = groq`
*[${conditions.join(" && ")}] {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  "company": company->{
    _id,
    name,
    website,
    image,
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

    const res = await sanityFetch<Array<Bedpres>>({
      query,
      tags: ["filtered-bedpresses"],
    });

    return bedpresSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
};
