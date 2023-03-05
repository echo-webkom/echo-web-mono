import sanityClient from 'part:@sanity/base/client';

const client = sanityClient.withConfig({ apiVersion: '2021-08-21' });

// Run this script from within your project folder in your terminal with: `sanity exec --with-user-token scripts/migrate-language.js`
//
// This will migrate documents in batches of 100 and continue patching until no more documents are
// returned from the query.
//
// This script can safely be run, even if documents are being concurrently modified by others.
// If a document gets modified in the time between fetch => submit patch, this script will fail,
// but can safely be re-run multiple times until it eventually runs out of documents to migrate.

// A few things to note:
// - This script will exit if any of the mutations fail due to a revision mismatch (which means the
//   document was edited between fetch => update)
// - The query must eventually return an empty set, or else this script will continue indefinitely

// Fetching documents that matches the precondition for the migration.
// NOTE: This query should eventually return an empty set of documents to mark the migration
// as complete

const fetchDocuments = () =>
    client.fetch(
        //`*[_type == 'happening' && !(_id in path('drafts.**'))][0...100] | order(date asc)
        `*[_type == 'post' && !(_id in path('drafts.**'))] | order(date asc)  {_id, _rev, title, body}`,
        //`*[_type == "post" && slug.current == "${slug}" && !(_id in path('drafts.**'))]| order(date asc)  {_id, _rev, title, body}`,
    );

const buildPatches = (docs) =>
    docs.map((doc) => ({
        id: doc._id,
        patch: {
            set: {
                body: { no: doc.body, en: '' },
                title: { no: doc.title, en: '' },
            },
            // this will cause the transaction to fail if the documents has been
            // modified since it was fetched.
            ifRevisionID: doc._rev,
        },
    }));

const createTransaction = (patches) =>
    patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), client.transaction());

const commitTransaction = (tx) => tx.commit();

const migrateNextBatch = async () => {
    const rawDocuments = await fetchDocuments();
    const documents = rawDocuments.filter((doc) => {
        if (doc.body === null || doc.title === null) {
            throw new Error('the body or title was null, maybe handle this manually!', doc, doc.body);
        }
        // NB: this will fail to convert if only one of the fields is converted
        // e.g. if the body is converted but not the title.
        const bodyIsFine = !(typeof doc.body === 'object' && doc.body !== null && Object.keys(doc.body).includes('no'));
        const titleIsFine = !(
            typeof doc.title === 'object' &&
            doc.title !== null &&
            Object.keys(doc.title).includes('no')
        );
        return bodyIsFine && titleIsFine;
    });
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
    //return migrateNextBatch();
};

migrateNextBatch().catch((err) => {
    console.error(err);
    process.exit(1);
});
