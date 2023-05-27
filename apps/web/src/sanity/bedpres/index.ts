import {groq} from "next-sanity";

import {type ErrorMessage} from "@/utils/error";
import {serverFetch} from "../client";
import {bedpresSchema, type Bedpres} from "./schemas";

export * from "./schemas";

export const fetchUpcomingBedpresses = async (n: number) => {
  const query = groq`
*[_type == "bedpres"
  && !(_id in path('drafts.**'))
  && dates.date >= now()]
  | order(date asc)
  {
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
}[0...$n]
    `;

  const params = {
    n: n > 0 ? n : -1,
  };

  const res = await serverFetch<Array<Bedpres>>(query, params);

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

  const res = await serverFetch<Bedpres>(query, params);

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

    const res = await serverFetch<Bedpres>(query);

    return bedpresSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
};
