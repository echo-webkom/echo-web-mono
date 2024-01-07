import { sanityFetch } from "../client";
import { slugSchema } from "../utils/slug";
import { availableJobAdsQuery, jobAdBySlugQuery, jobAdSlugsQuery, jobAdsQuery } from "./queries";
import { jobAdSchema, type JobAd } from "./schemas";

/**
 * Fetches all slugs for job ads
 *
 * @returns an array of slugs for all job ads
 */
export async function fetchJobAdPaths() {
  try {
    return await sanityFetch<Array<string>>({
      query: jobAdSlugsQuery,
      tags: ["job-ad-paths"],
    }).then((res) =>
      slugSchema
        .array()
        .parse(res)
        .map(({ slug }) => slug),
    );
  } catch {
    return [];
  }
}

/**
 * Fetches a number of job ads
 *
 * @param n number of job ads to fetch
 * @returns job ads or null if not found
 */
export async function fetchJobAds(n: number) {
  try {
    return await sanityFetch<Array<JobAd>>({
      query: jobAdsQuery,
      params: {
        n,
      },
      tags: ["job-ads"],
    }).then((res) => jobAdSchema.array().parse(res));
  } catch {
    return [];
  }
}

/**
 * Fetches a number of job ads where the deadline hasn't expired
 *
 * @param n the number of job ads to fetch
 * @returns job ads or an empty array if error
 */
export async function fetchAvailableJobAds(n: number) {
  try {
    return await sanityFetch<Array<JobAd>>({
      query: availableJobAdsQuery,
      params: {
        n,
      },
      tags: ["job-ads"],
    }).then((res) => jobAdSchema.array().parse(res));
  } catch {
    return [];
  }
}

/**
 * Fetches a job ad by its slug
 *
 * @param slug the slug of the job ad you want to fetch
 * @returns the job ad or null if not found
 */
export async function fetchJobAdBySlug(slug: string) {
  try {
    return await sanityFetch<JobAd | null>({
      query: jobAdBySlugQuery,
      params: {
        slug,
      },
      tags: [`job-ad-${slug}`],
    }).then((res) => jobAdSchema.parse(res));
  } catch {
    return null;
  }
}
