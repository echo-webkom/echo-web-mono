import languages from './languages';
import { defineType, defineField } from 'sanity';

const localeMarkdown = defineType({
    name: 'localeMarkdown',
    title: 'localeMarkdown',
    type: 'object',
    fields: languages.map((lang) => {
        if (lang.isDefault) {
            return defineField({
                title: lang.title,
                name: lang.id,
                type: 'markdown',
                validation: (Rule) => Rule.required(),
            });
        }

        return defineField({
            title: lang.title,
            name: lang.id,
            type: 'markdown',
        });
    }),
});

const localeString = defineType({
    name: 'localeString',
    title: 'localeString',
    type: 'object',
    fields: languages.map((lang) => {
        if (lang.isDefault) {
            return defineField({
                title: lang.title,
                name: lang.id,
                type: 'string',
                validation: (Rule) => Rule.required(),
            });
        }

        return defineField({
            title: lang.title,
            name: lang.id,
            type: 'string',
        });
    }),
});

export { localeMarkdown, localeString };
