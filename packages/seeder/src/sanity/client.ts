import { createClient } from "@sanity/client";

const projectId = "pgq2pd26";
const apiVersion = "2023-05-03";

export const DATASET = {
  production: "production",
  develop: "develop",
  testing: "testing",
} as const;

export type Dataset = (typeof DATASET)[keyof typeof DATASET];

export const clientWith = (dataset: Dataset) =>
  createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

// NEVER USE THIS FOR PRODUCTION!
export const writeClientWith = (dataset: "develop" | "testing", token: string) =>
  createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
