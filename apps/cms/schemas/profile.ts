import { UserIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'profile',
    title: 'Profil',
    description: 'Et medlem av en studentgruppe.',
    icon: UserIcon,
    type: 'document',
    preview: {
        select: {
            media: 'picture',
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
            name: 'picture',
            title: 'Bilde',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
    ],
});
