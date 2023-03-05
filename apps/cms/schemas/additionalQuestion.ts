import { HelpCircleIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
    name: 'additionalQuestion',
    title: 'Tilleggsspørsmål',
    description: 'Ekstra spørsmål til brukeren på et arrangement (f.eks. hvilken mat, allergier osv...)',
    icon: HelpCircleIcon,
    type: 'document',
    preview: {
        select: {
            title: 'questionText',
        },
    },
    fields: [
        defineField({
            name: 'questionText',
            title: 'Spørsmålstekst',
            validation: (Rule) => Rule.required(),
            type: 'string',
        }),
        defineField({
            name: 'inputType',
            title: 'Input-type',
            validation: (Rule) => Rule.required(),
            type: 'string',
            options: {
                list: ['radio', 'textbox'],
                layout: 'dropdown',
            },
        }),
        defineField({
            name: 'alternatives',
            title: 'Alternativer',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'string',
                    validation: (Rule) => Rule.required(),
                }),
            ],
        }),
    ],
});
