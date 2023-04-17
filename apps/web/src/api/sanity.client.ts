import {createClient} from "next-sanity";

/**
 * Project IDS:
 * Old sanity: "pgq2pd26",
 * New sanity: "nnumy1ga",
 *
 * Datasets:
 * "production" and "development"
 */

/**
 * Sanity client for client-side requests
 */
export const sanityClient = createClient({
  projectId: "nnumy1ga",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});

/**
 * Sanity client for server-side requests
 */
export const sanityServerClient = createClient({
  projectId: "nnumy1ga",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: false,
});
