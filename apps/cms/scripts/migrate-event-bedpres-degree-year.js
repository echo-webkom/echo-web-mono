import sanityClient from 'part:@sanity/base/client';

const client = sanityClient.withConfig({ apiVersion: '2021-08-21' });

const fetchDocuments = () =>
    client.fetch(`
    *[(_type == "event" || _type == "bedpres") && defined(registrationTime) && ((!defined(minDegreeYear) && !defined(maxDegreeYear)) || minDegreeYear == 0)] {
      _id,
      _rev,
      minDegreeYear,
      maxDegreeYear
    }
  `);

const shouldBeOne = (year) => {
    if (!year) {
        return true;
    }

    if (year === 0) {
        return true;
    }

    return false;
};

const buildPatches = (docs) =>
    docs.map((doc) => ({
        id: doc._id,
        patch: {
            set: {
                minDegreeYear: shouldBeOne(doc.minDegreeYear) ? 1 : doc.minDegreeYear,
                maxDegreeYear: doc.maxDegreeYear ? doc.maxDegreeYear : 5,
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
        console.log('No more documents to migrate');
        return null;
    }

    console.log(
        `Migrating batch:\n %s`,
        patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n'),
    );

    const transaction = createTransaction(patches);
    await commitTransaction(transaction);
    return migrateNextBatch();
};

migrateNextBatch().catch((err) => {
    console.log(err);
    process.exit(1);
});
