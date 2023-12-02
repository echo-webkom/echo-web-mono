const { createClient } = require("@sanity/client");

const token = "";
const projectId = "nnumy1ga";
const dataset = "production";
const apiVersion = "2021-10-21";

const client = createClient({
  apiVersion,
  projectId,
  dataset,
  token,
});

const fetchDocuments = () => client.fetch(`*[_type == "happening" && defined(spotRanges)]`);

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {
        spotRanges: doc.spotRanges.map((spotRange) => ({
          ...spotRange,
          minYear: spotRange.minDegreeYear,
          maxYear: spotRange.maxDegreeYear,
        })),
      },
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
