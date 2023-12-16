import "dotenv/config";

import { createClient } from "@sanity/client";

/**
 * MIGRATION INFO:
 *
 * Migration to remove a11y fields from post documents
 *
 * This migration should get all the post documents and
 * unset the a11y fields from the body and title fields,
 * then set the body and title fields to the norwegian
 * locale.
 *
 * As a bonus this migration also removes the publishedOnce
 * since it is not used.
 */

const token = process.env.SANITY_TOKEN;
const projectId = "nnumy1ga";
const dataset = "production";
const apiVersion = "2021-10-21";

const client = createClient({
  apiVersion,
  projectId,
  dataset,
  token,
});

const fetchDocuments = () => client.fetch(`*[_type == "studentGroup"]`);

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {
        description: doc.info,
        image: doc.grpPicture,
      },
      unset: ["grpPicture", "publishedOnce", "info"],
      ifRevisionID: doc._rev,
    },
  }));

const createTransaction = (patches) =>
  patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());

const commitTransaction = (tx) => tx.commit();

const migrateNextBatch = async () => {
  const documents = await fetchDocuments();
  const patches = buildPatches(documents);
  if (patches.length === 0) {
    console.log("No more documents to migrate!");
    return null;
  }
  console.log(
    `Migrating batch:\n %s`,
    patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join("\n"),
  );
  const transaction = createTransaction(patches);
  await commitTransaction(transaction);
  return migrateNextBatch();
};

migrateNextBatch().catch((err) => {
  console.error(err);
  process.exit(1);
});
