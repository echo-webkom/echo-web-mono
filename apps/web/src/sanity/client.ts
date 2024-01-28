import { createClient, type QueryParams } from "next-sanity";

import { env } from "@/env.mjs";

/**
 * Project IDS:
 * Old sanity: "pgq2pd26",
 * New sanity: "nnumy1ga",
 *
 * Datasets:
 * "production" and "development"
 */

export const projectId = "pgq2pd26";
export const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = "2023-05-03";

/**
 * Sanity client for client-side requests
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Sanity client for server-side requests
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as Array<string>;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
  revalidate = false,
}: {
  query: string;
  params?: QueryParams;
  tags: Array<string>;
  revalidate?: NextFetchRequestConfig["revalidate"];
}): Promise<QueryResponse> {
  return await client.fetch<QueryResponse>(query, params, {
    cache: "force-cache",
    next: {
      tags,
      revalidate,
    },
  });
}
