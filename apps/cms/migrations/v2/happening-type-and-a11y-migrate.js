import "dotenv/config";

import { createClient } from "@sanity/client";

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

const fetchDocuments = () => client.fetch(`*[_type == "happening"]`);

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {
        happeningType: (doc.happeningType ?? "EVENT").toLowerCase(),
        body: doc.body.no ?? doc.body,
        registrationStart: doc.registrationDate,
        registrationEnd: doc.registrationDeadline,
        cost: doc.deductiblePayment,
        registrationStartGroups: doc.studentGroupRegistrationDate,
        spotRanges:
          doc.spotRanges?.map((spotRange) => ({
            ...spotRange,
            minYear: spotRange.minDegreeYear,
            maxYear: spotRange.maxDegreeYear,
          })) ?? [],
      },
      unset: [
        "body.no",
        "body.en",
        "deductible",
        "registrationDate",
        "registrationDeadline",
        "isRegistration",
        "earlyReg",
      ],
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
