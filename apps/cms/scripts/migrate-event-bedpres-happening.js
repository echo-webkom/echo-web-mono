import sanityClient from 'part:@sanity/base/client';
import { nanoid } from 'nanoid';

const client = sanityClient.withConfig({ apiVersion: '2021-08-21' });

const fetchDocuments = () =>
    client.fetch(`
    *[_type == "event" || _type == "bedpres"]
    `);

const generateSpotRange = (name, minYear, maxYear, spots) => {
    return {
        _type: 'spotRange',
        title: name,
        minDegreeYear: minYear,
        maxDegreeYear: maxYear,
        spots: spots,
    };
};

const createHappening = async (doc) => {
    let spotRange = undefined;

    if (doc.registrationTime) {
        const spots = doc.spots;
        const minDegreeYear = doc.minDegreeYear;
        const maxDegreeYear = doc.maxDegreeYear;

        const name = `${minDegreeYear}. - ${maxDegreeYear}. trinn - ${spots} plasser`;
        const spotRangeResult = await client.fetch(`*[_type == "spotRange" && title == "${name}"]`);
        spotRange = spotRangeResult[0];
        console.log(spotRangeResult);
        if (typeof spotRange === 'undefined') {
            const newSpotRange = await client.create(generateSpotRange(name, minDegreeYear, maxDegreeYear, spots));
            spotRange = {
                _key: nanoid(),
                _ref: newSpotRange._id,
                _type: 'reference',
            };
        }
    }

    const newHappening = {
        _type: 'happening',
        title: doc.title,
        slug: doc.slug,
        happeningType: doc._type.toUpperCase(),
        date: doc.date,
        body: doc.body,
        logo: doc.logo,
        location: doc.location,
        author: doc.author,
        companyLink: doc.companyLink,
        registrationDate: doc.registrationTime,
        additionalQuestions: doc.additionalQuestions,
        spotRanges: spotRange ? [spotRange] : undefined,
    };

    client
        .create(newHappening)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
};

const run = async () => {
    const documents = await fetchDocuments();
    for (let i = 0; i < documents.length; i++) {
        await createHappening(documents[i]);
    }
};

run();
