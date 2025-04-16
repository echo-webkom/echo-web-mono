import { createClient } from "@sanity/client";

export const clientWith = (dataset: string) => {
  const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset,
    apiVersion: "2023-10-01",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
  });

  return client;
};
