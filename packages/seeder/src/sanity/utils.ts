import { DATASET, type Dataset } from "@echo-webkom/sanity";

export const parseEnv = (env: string | undefined): Dataset => {
  return DATASET[env as keyof typeof DATASET] || DATASET.develop;
};
