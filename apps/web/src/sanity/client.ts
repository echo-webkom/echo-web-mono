import { createClient, type QueryParams } from "next-sanity";

import { env } from "@/env.mjs";

/**
 * Project ID: "pgq2pd26",
 *
 * Datasets:
 * "production", "develop", "testing"
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

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
} & (
  | {
      tags?: Array<string>;
    }
  | {
      revalidate?: NextFetchRequestConfig["revalidate"];
    }
);

export async function sanityFetch<T>({ query, params, ...rest }: SanityFetchOptions): Promise<T> {
  const tags = "tags" in rest ? rest.tags : undefined;
  const revalidate = "revalidate" in rest ? rest.revalidate : undefined;

  if (revalidate !== undefined) {
    return await client.fetch(query, params ?? {}, {
      next: {
        revalidate,
      },
    });
  }

  return await client.fetch(query, params, {
    cache: "force-cache",
    next: {
      tags: tags ?? [],
    },
  });
}
