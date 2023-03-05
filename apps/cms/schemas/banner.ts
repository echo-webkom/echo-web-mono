import { InfoOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'banner',
    title: 'Forsidebanner',
    description: 'Banner som vises øverst på forsiden',
    icon: InfoOutlineIcon,
    type: 'document',
    preview: {
        select: {
            title: 'text',
        },
    },
    fields: [
        defineField({
            name: 'text',
            title: 'Bannertekst',
            validation: (Rule) => Rule.required(),
            type: 'string',
        }),
        defineField({
            name: 'color',
            title: 'Bannerfarge',
            validation: (Rule) => Rule.required(),
            type: 'color',
        }),
        defineField({
            name: 'textColor',
            title: 'Farge på bannertekst',
            validation: (Rule) => Rule.required(),
            type: 'color',
        }),
        defineField({
            name: 'linkTo',
            title: 'Lenke til intern/ekstern side',
            type: 'string',
        }),
        defineField({
            name: 'isExternal',
            title: 'Er linken til en ekstern side?',
            description: 'En ekstern side er en side som ikke er på echo.uib.no.',
            type: 'boolean',
            initialValue: false,
        }),
    ],
});
