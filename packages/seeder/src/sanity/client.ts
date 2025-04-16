import { createClient } from "@sanity/client";

export const clientWith = (dataset: string) => {
  const client = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset,
    apiVersion: "2023-10-01",
    useCdn: false,
  });

  return client;
};
