import { type MerchQueryResult } from "@echo-webkom/cms/types";
import { merchQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches info for the merchstore
 */
export const fetchAllMerch = async () => {
  return await sanityFetch<MerchQueryResult>({
    query: merchQuery,
    cdn: true,
    tags: ["merch"],
  }).catch(() => {
    console.error("Failed to fetch all merch");

    return [];
  });
};

export const fetchPosts = async (n?: number) => {
  const posts = await fetchAllMerch();

  return n ? posts.slice(0, n) : posts;
};

/**
 * Fetches merch by its slug
 *
 * @param slug the slug of the merch you want to fetch
 * @returns the merch or null if not found
 */
export const fetchMerchBySlug = async (slug: string): Promise<MerchQueryResult[number] | null> => {
  return await fetchAllMerch().then(
    (res) => res.find((merch) => merch.slug.current === slug) ?? null,
  );
};
