import { BlockContentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'staticInfo',
    title: 'Static Info',
    icon: BlockContentIcon,
    description: 'Statisk Informasjon',
    type: 'document',
    preview: {
        select: {
            title: 'name',
        },
    },
    fields: [
        defineField({
            name: 'name',
            title: 'Navn',
            validation: (Rule) => Rule.required(),
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug (lenke)',
            validation: (Rule) => Rule.required(),
            type: 'slug',
            options: {
                source: 'name',
            },
        }),
        defineField({
            name: 'info',
            title: 'Brødtekst',
            validation: (Rule) => Rule.required(),
            type: 'markdown',
        }),
    ],
});
