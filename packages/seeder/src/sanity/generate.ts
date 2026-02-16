/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { IdentifiedSanityDocumentStub } from "@sanity/client";
import groq from "groq";

import { clientWith, writeClientWith, type Dataset } from "@echo-webkom/sanity";

import { companies, locations, makeHappenings, makeJobAds } from "./fixtures";

export type Options = {
  dataset: Dataset;
};

const PRODUCTION_TYPES = ["studentGroup", "post", "staticInfo", "profile"] as const;

/**
 * Recursively strip references to documents not in our set.
 * Handles image/file assets, dangling refs, dev-only refs, etc.
 */
const stripDanglingRefs = (obj: any, knownIds: Set<string>): any => {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((item) => stripDanglingRefs(item, knownIds))
      .filter((item) => item !== undefined);
  }

  // Drop any reference to a document not in our set
  if (obj._type === "reference" && obj._ref && !knownIds.has(obj._ref)) {
    return undefined;
  }

  // Drop image/file objects with asset references (assets are never in our set)
  if ((obj._type === "image" || obj._type === "file") && obj.asset?._ref) {
    return undefined;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const stripped = stripDanglingRefs(value, knownIds);
    if (stripped !== undefined) {
      result[key] = stripped;
    }
  }
  return result;
};

const fetchProductionDocuments = async () => {
  const prodClient = clientWith("production");

  const docs = await prodClient.fetch<Array<IdentifiedSanityDocumentStub>>(
    groq`*[_type in $types && !(_id in path('drafts.**'))]`,
    { types: PRODUCTION_TYPES },
  );

  console.log(
    `📥 Fetched ${docs.length} published documents from production (${PRODUCTION_TYPES.join(", ")})`,
  );

  return docs;
};

/**
 * Insert and generate test data in Sanity, based on production data and our fixtures.
 * Strips any references to documents not included in our set, to avoid dangling refs.
 */
export const generate = async ({ dataset }: Options) => {
  if (dataset === "production") {
    throw new Error("Refusing to generate test data in the production dataset");
  }

  const token = process.env.SANITY_TOKEN;
  if (!token) {
    throw new Error("SANITY_TOKEN environment variable is required");
  }

  const client = writeClientWith(dataset, token);

  const productionDocs = await fetchProductionDocuments();

  // Combine production documents with our fixtures
  const allDocuments: Array<IdentifiedSanityDocumentStub> = [
    ...productionDocs,
    ...locations,
    ...companies,
    ...makeHappenings(),
    ...makeJobAds(),
  ];

  const knownIds = new Set(allDocuments.map((doc) => doc._id));
  // Strip any references to documents not in our set, to avoid dangling refs
  const cleanedDocuments = allDocuments.map((doc) => stripDanglingRefs(doc, knownIds));

  const tx = client.transaction();
  for (const doc of cleanedDocuments) {
    tx.createOrReplace(doc);
  }

  await tx.commit({ visibility: "async" });

  console.log(`✅ Generated ${cleanedDocuments.length} documents in "${dataset}" dataset`);
};
