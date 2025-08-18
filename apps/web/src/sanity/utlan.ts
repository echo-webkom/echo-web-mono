import { type AllUtlanQueryResult } from "@echo-webkom/cms/types";
import { allUtlanQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches all utlan.
 */
export const fetchAllUtlan = async () => {
  return await sanityFetch<AllUtlanQueryResult>({
    query: allUtlanQuery,
    cdn: true,
    tags: ["utlan"],
  }).catch(() => {
    console.error("Failed to fetch all utlan");

    return [];
  });
};

export const fetchUtlan = async (n?: number) => {
  const utlan = await fetchAllUtlan();

  return n ? utlan.slice(0, n) : utlan;
};

/**
 * Fetches a utlan item by its slug
 *
 * @param slug the slug of the utlan items you want to fetch
 * @returns the utlan item or null if not found
 */
export const fetchUtlanBySlug = async (
  slug: string,
): Promise<AllUtlanQueryResult[number] | null> => {
  return await fetchUtlan().then((res) => res.find((item) => item.slug === slug) ?? null);
};
