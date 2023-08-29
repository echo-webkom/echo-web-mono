import { createClient } from "next-sanity";

import { env } from "@/env.mjs";

/**
 * Project IDS:
 * Old sanity: "pgq2pd26",
 * New sanity: "nnumy1ga",
 *
 * Datasets:
 * "production" and "development"
 */

export const projectId = "nnumy1ga";
export const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
export const apiVersion = "2021-04-10";

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
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const clientFetch = sanityClient.fetch.bind(sanityClient);
export const serverFetch = sanityServerClient.fetch.bind(sanityServerClient);
