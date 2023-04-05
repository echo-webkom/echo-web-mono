import {createClient} from "next-sanity";

/**
 * Sanity client for client-side requests
 */
export const sanityClient = createClient({
  // projectId: "pgq2pd26",
  projectId: "nnumy1ga",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: true,
});

/**
 * Sanity client for server-side requests
 */
export const sanityServerClient = createClient({
  // projectId: "pgq2pd26",
  projectId: "nnumy1ga",
  dataset: "production",
  apiVersion: "2021-04-10",
  useCdn: false,
});
