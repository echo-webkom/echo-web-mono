import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Project ID: "pgq2pd26",
 *
 * Datasets:
 * "production", "develop", "testing"
 */
export const DEFAULT_PROJECT_ID = "pgq2pd26";
export const DEFAULT_DATASET = "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET;
export const apiVersion = "2023-05-03";

export const DATASET = {
  production: "production",
  develop: "develop",
  testing: "testing",
} as const;

export type Dataset = (typeof DATASET)[keyof typeof DATASET];

const options = {
  projectId,
  dataset,
  apiVersion,
};

/**
 * Sanity client for client-side requests
 */
export const cdnClient = createClient({
  ...options,
  useCdn: true,
});

/**
 * Sanity client for server-side requests
 */
export const client = createClient({
  ...options,
  useCdn: false,
});

export const clientWith = (dataset: Dataset) =>
  createClient({
    ...options,
    dataset,
    useCdn: false,
  });

const builder = imageUrlBuilder(cdnClient);
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
