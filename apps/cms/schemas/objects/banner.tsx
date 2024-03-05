import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Undertittel",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Lenke",
      description:
        'Lenke til annen side. Skal starte med "/" eller "https". Ikke påkrevet for å lage banner.',
      type: "string",
      validation: (Rule) =>
        Rule.custom((link) => {
          if (!link) {
            return true;
          }

          const isValidLink = link.startsWith("/") || link.startsWith("https");

          return isValidLink ? true : 'Lenken må starte med "/" eller "https"';
        }),
    }),
    // TODO Add color field
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      link: "link",
    },
    prepare: ({
      title,
      subtitle,
      link,
    }: {
      title: string;
      subtitle: string | null;
      link: string | null;
    }) => {
      return {
        title: title,
        subtitle: subtitle ?? undefined,
        media: link ? "🔗" : "🚫",
      };
    },
  },
});
