import { NumberIcon } from '@sanity/icons';
import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'spotRange',
    title: 'Arrangementsplasser',
    description: 'Hvor mange plasser som er tildelt hvert trinn på et arrangement.',
    icon: NumberIcon,
    type: 'document',
    preview: {
        select: {
            title: 'title',
        },
    },
    fields: [
        defineField({
            name: 'title',
            title: 'Tittel',
            validation: (Rule) => Rule.required(),
            type: 'string',
        }),
        defineField({
            name: 'minDegreeYear',
            title: 'Minste trinn',
            type: 'number',
            validation: (Rule) => Rule.required().min(1).max(5),
        }),
        defineField({
            name: 'maxDegreeYear',
            title: 'Største trinn',
            type: 'number',
            validation: (Rule) => Rule.required().min(Rule.valueOfField('minDegreeYear')).max(5),
        }),
        defineField({
            name: 'spots',
            title: 'Antall plasser',
            validation: (Rule) => Rule.required(),
            type: 'number',
        }),
    ],
});
