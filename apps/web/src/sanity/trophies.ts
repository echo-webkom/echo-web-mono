import { createClient } from "@sanity/client";
import { allTrophiesQuery } from "./trophies-queries";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "pgq2pd26";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2023-05-03";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const fetchAllTrophies = async () => {
  return client.fetch(allTrophiesQuery);
};
