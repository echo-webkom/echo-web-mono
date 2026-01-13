import { type AllTrophiesQueryResult } from "@echo-webkom/cms/types";
import { allTrophiesQuery } from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

export const fetchAllTrophies = async () => {
  return await sanityFetch<AllTrophiesQueryResult>({
    query: allTrophiesQuery,
    cdn: true,
    tags: ["trophies"],
  }).catch(() => {
    console.error("Failed to fetch all trophies");
    return [];
  });
};
