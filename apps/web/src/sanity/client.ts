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

const baseURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${process.env.PORT ?? 3000}`;

/**
 * Used to communicate with the proxy server
 */
export const proxyFetch = async <T>(
  query: string,
  params: QueryParams,
  options: RequestInit,
): Promise<T> => {
  const url = new URL(baseURL);
  url.pathname = "/api/sanity/proxy";
  url.searchParams.append("query", query);
  url.searchParams.append("params", JSON.stringify(params));

  // eslint-disable-next-line no-console
  console.log(
    `Proxying request to ${url} with params ${JSON.stringify(params)} and options ${JSON.stringify(
      options,
    )}`,
  );

  const result = await fetch(url, {
    ...options,
    method: "POST",
  })
    .then((res) => res.json() as T)
    .catch((error) => {
      console.error(error);
      throw error;
    });

  // eslint-disable-next-line no-console
  console.log(`Response from proxy ${JSON.stringify(result)} at ${new Date().toISOString()}`);

  return result;
};

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as Array<string>;

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags: Array<string>;
}): Promise<QueryResponse> {
  return await proxyFetch<QueryResponse>(query, params, {
    cache: "force-cache",
    next: {
      tags,
    },
  });
}
