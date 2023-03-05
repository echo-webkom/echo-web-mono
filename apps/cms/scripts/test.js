import sanityClient from 'part:@sanity/base/client';

const client = sanityClient.withConfig({ apiVersion: '2021-08-21' });

const generateSpotRange = (name, minYear, maxYear, spots) => {
    return {
        _type: 'spotRange',
        title: name,
        minDegreeYear: minYear,
        maxDegreeYear: maxYear,
        spots: spots,
    };
};

const run = async () => {
    const newSpotRange = await client.create(generateSpotRange('hei', 1, 2, 3));
    console.log(newSpotRange);
};

run();
