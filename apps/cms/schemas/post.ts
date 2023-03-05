import slugify from 'slugify';
import { EnvelopeIcon } from '@sanity/icons';
import { defineField } from 'sanity';

export default {
    name: 'post',
    title: 'Innlegg',
    type: 'document',
    icon: EnvelopeIcon,
    preview: {
        select: {
            title: 'title.no',
            subtitle: 'author.name',
        },
    },
    fields: [
        defineField({
            name: 'publishedOnce',
            type: 'boolean',
            hidden: true,
        }),
        defineField({
            name: 'title',
            title: 'Tittel',
            validation: (Rule) => Rule.required(),
            type: 'localeString',
        }),
        defineField({
            name: 'slug',
            title: 'Slug (lenke)',
            validation: (Rule) => Rule.required(),
            description: 'Unik identifikator for innlegget. Bruk "Generate"-knappen! Ikke skriv inn på egenhånd!',
            type: 'slug',
            options: {
                source: 'title',
                slugify: (input: string) => slugify(input, { remove: /[*+~.()'"!:@]/g, lower: true, strict: true }),
            },
        }),
        defineField({
            name: 'body',
            title: 'Brødtekst',
            validation: (Rule) => Rule.required(),
            type: 'localeMarkdown',
        }),
        defineField({
            name: 'author',
            title: 'Forfatter',
            validation: (Rule) => Rule.required(),
            type: 'reference',
            to: [
                {
                    type: 'author',
                },
            ],
        }),
        defineField({
            name: 'thumbnail',
            title: 'Miniatyrbilde',
            type: 'image',
        }),
    ],
};
