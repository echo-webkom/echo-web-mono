import { groq } from "next-sanity";

import { type QueryParams } from "@/components/event-filter";
import { type ErrorMessage } from "@/utils/error";
import { sanityFetch } from "../client";
import { bedpresSchema, type Bedpres } from "./schemas";

export * from "./schemas";

export async function fetchUpcomingBedpresses(n: number) {
  const query = groq`
*[_type == "happening"
  && happeningType == "bedpres"
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
  "date": date,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
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

  try {
    const res = await sanityFetch<Array<Bedpres>>({
      query,
      params,
      tags: ["upcoming-bedpresses"],
    });

    return bedpresSchema.array().parse(res);
  } catch (error) {
    return null;
  }
}

export async function fetchBedpresBySlug(slug: string) {
  const query = groq`
*[_type == "happening"
  && happeningType == "bedpres"
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
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": dates.registrationStart,
  "registrationEnd": dates.registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
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

  try {
    const res = await sanityFetch<Bedpres>({
      query,
      params,
      tags: [`bedpres-${slug}`],
    });

    return bedpresSchema.parse(res);
  } catch (error) {
    return null;
  }
}

export const fetchFilteredBedpresses = async (
  q: QueryParams,
): Promise<Array<Bedpres> | ErrorMessage> => {
  const conditions = [
    `_type == "happening"`,
    `!(_id in path('drafts.**'))`,
    q.type === "all" ? null : `happeningType == "${q.type}"`,
    q.open ? `registrationStart <= now() && registrationEnd > now()` : null,
    q.past ? `date < now()` : `date >= now()`,
    q.search ? `title match "*${q.search}*"` : null,
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
  "date": date,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
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
