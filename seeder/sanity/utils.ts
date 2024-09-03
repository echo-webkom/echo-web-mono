import { Dataset, DATASET } from "@/sanity/client";

export const parseEnv = (env: string | undefined): Dataset => {
  return DATASET[env as keyof typeof DATASET] || DATASET.develop;
};
