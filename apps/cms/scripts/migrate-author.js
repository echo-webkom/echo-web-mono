import sanityClient from 'part:@sanity/base/client';

const client = sanityClient.withConfig({ apiVersion: '2021-08-21' });

const fetchDocuments = () =>
    client.fetch(
        `*[_type == 'happening' && !(_id in path('drafts.**')) && defined(author) && !defined(studentGroupName) ][0...100] {_id, _rev, "author": author -> name}`,
    );

const authorToName = (author) => {
    if (author === 'Gnist') return 'gnist';
    if (author === 'Tilde') return 'tilde';
    if (author === 'Webkom') return 'webkom';
    if (author === 'Bedkom') return 'bedkom';
    return 'hovedstyret';
};

const buildPatches = (docs) =>
    docs.map((doc) => {
        console.log(JSON.stringify(doc));
        return {
            id: doc._id,
            patch: {
                set: { studentGroupName: authorToName(doc.author) },
                // Don't unset author yet :)
                // unset: ['author'],
                ifRevisionID: doc._rev,
            },
        };
    });

const createTransaction = (patches) =>
    patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());

const commitTransaction = (tx) => tx.commit();

const migrateNextBatch = async () => {
    const documents = await fetchDocuments();
    const patches = buildPatches(documents);
    if (patches.length === 0) {
        console.log('No more documents to migrate!');
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
    console.error(err);
    process.exit(1);
});
