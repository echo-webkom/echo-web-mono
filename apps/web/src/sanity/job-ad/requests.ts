import { isPast } from "date-fns";

import { type JobAdsQueryResult } from "@/sanity.types";
import { sanityFetch } from "../client";
import { jobAdsQuery } from "./queries";

const isExpired = (expiresAt: string) => isPast(expiresAt);

/**
 * Fetches a number of job ads
 *
 * @param n number of job ads to fetch
 * @returns job ads or null if not found
 */
export const fetchJobAds = async () => {
  return await sanityFetch<JobAdsQueryResult>({
    query: jobAdsQuery,
    cdn: true,
    tags: ["job-ads"],
  }).catch(() => {
    console.error("Failed to fetch job ads");

    return [];
  });
};

/**
 * Fetches all slugs for job ads
 *
 * @returns an array of slugs for all job ads
 */
export const fetchJobAdPaths = async () => {
  return await fetchJobAds().then((res) => res.map((jobAd) => jobAd.slug));
};

/**
 * Fetches a number of job ads where the deadline hasn't expired
 *
 * @param n the number of job ads to fetch
 * @returns job ads or an empty array if error
 */
export const fetchAvailableJobAds = async (n: number): Promise<JobAdsQueryResult> => {
  return await fetchJobAds().then((res) =>
    res.filter((jobAd) => !isExpired(jobAd.expiresAt)).slice(0, n),
  );
};

/**
 * Fetches a job ad by its slug
 *
 * @param slug the slug of the job ad you want to fetch
 * @returns the job ad or null if not found
 */
export const fetchJobAdBySlug = async (slug: string): Promise<JobAdsQueryResult[number] | null> => {
  return await fetchJobAds().then(
    (res) => res.find((jobAd) => jobAd.slug === slug && !isExpired(jobAd.expiresAt)) ?? null,
  );
};
