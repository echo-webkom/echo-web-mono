import { env } from "$env/dynamic/private";
import { createClient } from "@sanity/client";

/**
 * Project ID: "pgq2pd26",
 *
 * Datasets:
 * "production", "develop", "testing"
 */
export const DEFAULT_PROJECT_ID = "pgq2pd26";
export const DEFAULT_DATASET = "production";

export const projectId = env.SANITY_PROJECT_ID ?? DEFAULT_PROJECT_ID;
export const dataset = env.SANITY_DATASET ?? DEFAULT_DATASET;
export const apiVersion = "2023-05-03";

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

export const sanityCdn = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});