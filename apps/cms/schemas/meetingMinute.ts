import { DocumentPdfIcon } from '@sanity/icons';
import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'meetingMinute',
    title: 'Møtereferat',
    icon: DocumentPdfIcon,
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
            name: 'document',
            title: 'Dokument',
            validation: (Rule) => Rule.required(),
            type: 'file',
        }),
        defineField({
            name: 'date',
            title: 'Dato for møte',
            validation: (Rule) => Rule.required(),
            type: 'datetime',
        }),
        defineField({
            name: 'allmote',
            title: 'Er møtet ett allmøte?',
            validation: (Rule) => Rule.required(),
            type: 'boolean',
        }),
    ],
});
