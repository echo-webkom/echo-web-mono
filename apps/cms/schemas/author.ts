import { BookIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'author',
    title: 'Forfatter',
    icon: BookIcon,
    description: 'Den som har publisert innholdet (happening, post, osv...). Navn på undergruppe er foretrukket.',
    type: 'document',
    preview: {
        select: {
            title: 'name',
        },
    },
    fields: [
        defineField({
            name: 'name',
            title: 'Forfatter',
            validation: (Rule) => Rule.required(),
            type: 'string',
        }),
    ],
});
