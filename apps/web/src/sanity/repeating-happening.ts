import { type AllRepeatingHappeningsQueryResult } from "@echo-webkom/cms/types";
import { allRepeatingHappeningsQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

/**
 * Fetches all repeating happenings
 */
export const fetchAllRepeatingHappenings = async () => {
  return await sanityFetch<AllRepeatingHappeningsQueryResult>({
    query: allRepeatingHappeningsQuery,
    tags: ["repeating-happenings"],
  }).catch(() => {
    console.error("Failed to fetch all repeating happenings");

    return [];
  });
};

/**
 * Fetch a repeating happening by slug
 */
export const fetchRepeatingHappening = async (slug: string) => {
  return await fetchAllRepeatingHappenings().then((repeatingHappenings) => {
    return repeatingHappenings.find((happening) => happening.slug === slug) ?? null;
  });
};
