import { type AllMerchQueryResult } from "@echo-webkom/cms/types";
import { allMerchQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches all merch.
 */
export const fetchAllMerch = async () => {
  return await sanityFetch<AllMerchQueryResult>({
    query: allMerchQuery,
    cdn: true,
    tags: ["merch"],
  }).catch(() => {
    console.error("Failed to fetch all merch");

    return [];
  });
};

export const fetchMerch = async (n?: number) => {
  const merch = await fetchAllMerch();

  return n ? merch.slice(0, n) : merch;
};

/**
 * Fetches a merch item by its slug
 *
 * @param slug the slug of the merch items you want to fetch
 * @returns the merch item or null if not found
 */
export const fetchMerchBySlug = async (
  slug: string,
): Promise<AllMerchQueryResult[number] | null> => {
  return await fetchMerch().then((res) => res.find((item) => item.slug === slug) ?? null);
};
