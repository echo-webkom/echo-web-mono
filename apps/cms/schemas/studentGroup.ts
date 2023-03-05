import { UsersIcon } from '@sanity/icons';
import slugify from 'slugify';
import { defineField, defineType, defineArrayMember } from 'sanity';

const GROUP_TYPES = [
    { title: 'Undergruppe', value: 'subgroup' },
    { title: 'Underorganisasjon', value: 'suborg' },
    { title: 'Hovedstyre', value: 'board' },
    { title: 'Interessegruppe', value: 'intgroup' },
];

export default defineType({
    name: 'studentGroup',
    title: 'Studentgruppe',
    description: 'Undergruppe, underorganisasjon eller et echo-styre',
    icon: UsersIcon,
    type: 'document',
    preview: {
        select: {
            title: 'name',
            groupType: 'groupType',
        },
        prepare({ title, groupType }) {
            const [subtitle] = GROUP_TYPES.flatMap((option) => (option.value === groupType ? option.title : []));

            return {
                title,
                subtitle,
            };
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
            description: 'Unik identifikator for studentgruppen. Bruk "Generate"-knappen! Ikke skriv inn på egenhånd!',
            type: 'slug',
            options: {
                source: 'name',
                slugify: (input: string) => slugify(input, { remove: /[*+~.()'"!:@]/g, lower: true, strict: true }),
            },
        }),
        defineField({
            name: 'groupType',
            title: 'Type',
            validation: (Rule) =>
                Rule.required()
                    .custom((type) =>
                        type === 'subgroup' || type === 'suborg' || type === 'board' || type === 'intgroup'
                            ? true
                            : 'Må være "subgroup", "suborg", "intgroup" eller "board"',
                    )
                    .error(),
            type: 'string',
            options: {
                list: GROUP_TYPES,
                layout: 'dropdown',
            },
        }),
        defineField({
            name: 'info',
            title: 'Brødtekst',
            type: 'markdown',
        }),
        defineField({
            name: 'grpPicture',
            title: 'Gruppebilde',
            type: 'image',
        }),
        defineField({
            name: 'members',
            title: 'Medlemmer',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'member',
                    title: 'Medlem',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'role',
                            title: 'Rolle',
                            type: 'string',
                            validation: (Rule) => Rule.required(),
                        }),
                        defineField({
                            name: 'profile',
                            title: 'Profil',
                            type: 'reference',
                            to: [{ type: 'profile' }],
                            validation: (Rule) => Rule.required(),
                        }),
                    ],
                    preview: {
                        select: {
                            media: 'profile.picture',
                            title: 'profile.name',
                            subtitle: 'role',
                        },
                    },
                }),
            ],
        }),
    ],
});
