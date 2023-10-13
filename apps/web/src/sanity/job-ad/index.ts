import { groq } from "next-sanity";

import { sanityFetch } from "../client";
import { slugSchema } from "../utils/slug";
import { jobAdSchema, type JobAd, type JobType } from "./schemas";

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
export async function fetchJobAdPaths() {
  try {
    const query = groq`*[_type == "job"]{ "slug": slug.current }`;
    const result = await sanityFetch<Array<string>>({
      query,
      tags: ["job-ad-paths"],
    });

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
}

/**
 * @param n - number of job ads to fetch
 * @returns Array of job ads or an error message
 */
export async function fetchJobAds(n: number) {
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

  const result = await sanityFetch<Array<JobAd>>({
    query,
    params,
    tags: ["job-ads"],
  });

  return jobAdSchema.array().parse(result);
}

export async function fetchAvailableJobAds(n: number) {
  const query = groq`
*[_type == "job"
  && !(_id in path('drafts.**'))
  && deadline >= now()]
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

  const result = await sanityFetch<Array<JobAd>>({
    query,
    params,
    tags: ["job-ads"],
  });

  return jobAdSchema.array().parse(result);
}

export async function fetchJobAdBySlug(slug: string) {
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

  const result = await sanityFetch<JobAd | null>({
    query,
    params,
    tags: [`job-ad-${slug}`],
  });

  if (!result) {
    return null;
  }

  return jobAdSchema.parse(result);
}
