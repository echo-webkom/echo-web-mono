import {groq} from "next-sanity";

import {type ErrorMessage} from "@/utils/error";
import {sanityClient} from "../sanity.client";
import {bedpresSchema, type Bedpres} from "./schemas";

export * from "./schemas";

export const fetchUpcomingBedpresses = async (
  n: number,
): Promise<Array<Bedpres> | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "bedpres"
  && !(_id in path('drafts.**'))
  && dates.date >= now()]
  | order(date asc)
  [0..$n] {
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

    const res = await sanityClient.fetch<Array<Bedpres>>(query, params);

    return bedpresSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch upcoming bedpresses.",
    };
  }
};

export const fetchBedpresBySlug = async (slug: string): Promise<Bedpres | ErrorMessage> => {
  try {
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

    const res = await sanityClient.fetch<Bedpres>(query, params);

    return bedpresSchema.parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
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

    const res = await sanityClient.fetch<Bedpres>(query);

    return bedpresSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
};
