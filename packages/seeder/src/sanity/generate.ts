/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createReadStream } from "node:fs";
import type { IdentifiedSanityDocumentStub, SanityClient } from "@sanity/client";
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

  // Drop image/file objects whose asset is not in our known set
  if (
    (obj._type === "image" || obj._type === "file") &&
    obj.asset?._ref &&
    !knownIds.has(obj.asset._ref)
  ) {
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

const uploadCompanyImages = async (client: SanityClient) => {
  const docs: Array<IdentifiedSanityDocumentStub> = [];
  const assetIds: Array<string> = [];

  for (const company of companies) {
    const { imagePath, ...doc } = company;

    const asset = await client.assets.upload("image", createReadStream(imagePath), {
      filename: `${doc.name.toLowerCase()}.png`,
    });

    assetIds.push(asset._id);
    docs.push({
      ...doc,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    });

    console.log(`📸 Uploaded image for ${doc.name}`);
  }

  return { docs, assetIds };
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

  // Upload company images and build company documents with image references
  const { docs: companyDocs, assetIds } = await uploadCompanyImages(client);

  // Fixture documents get refreshed every run (dates change)
  const fixtureDocuments: Array<IdentifiedSanityDocumentStub> = [
    ...locations,
    ...companyDocs,
    ...makeHappenings(),
    ...makeJobAds(),
  ];

  const allDocuments: Array<IdentifiedSanityDocumentStub> = [
    ...productionDocs,
    ...fixtureDocuments,
  ];

  const knownIds = new Set([...allDocuments.map((doc) => doc._id), ...assetIds]);
  // Strip any references to documents not in our set, to avoid dangling refs
  const cleanedProdDocs = productionDocs.map((doc) => stripDanglingRefs(doc, knownIds));
  const cleanedFixtureDocs = fixtureDocuments.map((doc) => stripDanglingRefs(doc, knownIds));

  const tx = client.transaction();

  // Production docs: createIfNotExists so we don't overwrite manual changes (e.g. uploaded images)
  for (const doc of cleanedProdDocs) {
    tx.createIfNotExists(doc);
  }

  // Fixture docs: createOrReplace to keep dates fresh
  for (const doc of cleanedFixtureDocs) {
    tx.createOrReplace(doc);
  }

  await tx.commit({ visibility: "async" });

  console.log(`✅ Generated ${allDocuments.length} documents in "${dataset}" dataset`);
};
