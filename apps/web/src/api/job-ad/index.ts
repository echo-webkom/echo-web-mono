import {groq} from "next-sanity";

import {type ErrorMessage} from "@/utils/error";
import {sanityClient} from "../sanity.client";
import {slugSchema} from "../utils/slug";
import {jobAdSchema, type JobAd, type JobType} from "./schemas";

export * from "./schemas";

// TODO: Move to @/lib
export const jobTypeToString: Record<JobType, string> = {
  fulltime: "Fulltid",
  parttime: "Deltid",
  internship: "Internship",
  summerjob: "Sommerjobb",
};

/**
 * @returns Array of slugs for all job ads
 */
export const fetchJobAdPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "job"]{ "slug": slug.current }`;
    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

/**
 * @param n - number of job ads to fetch
 * @returns Array of job ads or an error message
 */
export const fetchJobAds = async (n: number): Promise<Array<JobAd> | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "job"
  && !(_id in path('drafts.**'))]
  | order(_createdAt desc) {
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
  "locations": locations[]->{
    _id,
    name,
  },
  jobType,
  link,
  deadline,
  degreeYears,
  body
}[0..$n]
      `;

    const params = {
      n,
    };

    const result = await sanityClient.fetch<Array<JobAd>>(query, params);

    return jobAdSchema.array().parse(result);
  } catch {
    return {
      message: "Failed to fetch job ads.",
    };
  }
};

export const fetchJobAdBySlug = async (slug: string): Promise<JobAd | ErrorMessage> => {
  try {
    const query = groq`
*[_type == "job"
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
  "locations": locations[]->{
    _id,
    name,
  },
  jobType,
  link,
  deadline,
  degreeYears,
  body
}[0]
      `;

    const params = {
      slug,
    };

    const result = await sanityClient.fetch<JobAd>(query, params);

    return jobAdSchema.parse(result);
  } catch {
    return {
      message: "Failed to fetch job ad by slug.",
    };
  }
};
