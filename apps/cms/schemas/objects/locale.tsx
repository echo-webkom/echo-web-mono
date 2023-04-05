import {defineField, defineType} from "sanity";

const LOCALES = [
  {id: "no", title: "Norsk"},
  {id: "en", title: "Engelsk"},
];

export const localeString = defineType({
  name: "localeString",
  title: "Tekst",
  type: "object",
  groups: LOCALES.map((locale) => ({
    name: locale.id,
    title: locale.title,
  })),
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: "string",
      group: locale.id,
    }),
  ),

  preview: {
    select: {
      title: "no",
    },
  },
});

export const localeMarkdown = defineType({
  name: "localeMarkdown",
  title: "Tekst",
  type: "object",
  groups: LOCALES.map((locale) => ({
    name: locale.id,
    title: locale.title,
  })),
  fields: LOCALES.map((locale) =>
    defineField({
      name: locale.id,
      title: locale.title,
      type: "markdown",
      group: locale.id,
    }),
  ),

  preview: {
    select: {
      title: "no",
    },
  },
});
