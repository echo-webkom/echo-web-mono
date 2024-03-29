import { Logger } from "@/lib/logger";
import { sanityFetch } from "../client";
import { jobAdsQuery } from "./queries";
import { jobAdSchema } from "./schemas";

/**
 * Fetches a number of job ads
 *
 * @param n number of job ads to fetch
 * @returns job ads or null if not found
 */
export async function fetchJobAds() {
  return await sanityFetch({
    query: jobAdsQuery,
    cdn: true,
    tags: ["job-ads"],
  })
    .then((res) => jobAdSchema.array().parse(res))
    .catch(() => {
      Logger.error(fetchJobAds.name, "Failed to fetch job ads");

      return [];
    });
}

/**
 * Fetches all slugs for job ads
 *
 * @returns an array of slugs for all job ads
 */
export async function fetchJobAdPaths() {
  return await fetchJobAds().then((res) => res.map((jobAd) => jobAd.slug));
}

/**
 * Fetches a number of job ads where the deadline hasn't expired
 *
 * @param n the number of job ads to fetch
 * @returns job ads or an empty array if error
 */
export async function fetchAvailableJobAds(n: number) {
  return await fetchJobAds().then((res) =>
    res.filter((jobAd) => new Date(jobAd.deadline) > new Date()).slice(0, n),
  );
}

/**
 * Fetches a job ad by its slug
 *
 * @param slug the slug of the job ad you want to fetch
 * @returns the job ad or null if not found
 */
export async function fetchJobAdBySlug(slug: string) {
  return await fetchJobAds().then((res) => res.find((jobAd) => jobAd.slug === slug));
}
