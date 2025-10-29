import { StarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "trophies",
  title: "Troféer",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      description: "Dette blir en felles tittel, uansett om du har oppnådd troféet eller ikke.",
      placeholder: "F.eks. Gokart",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Genereres automatisk fra tittel",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "baseImage",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
      description: "Dette bildet vises når en bruker ikke har oppnådd dette troféet",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "baseDescription",
      title: "Beskrivelse",
      type: "text",
      rows: 3,
      description: "Denne teksten vises når en bruker ikke har oppnådd dette troféet",
      placeholder: "F.eks. 'Bli med på gokart for å få dette troféet'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trophies",
      title: "Legg til trofé",
      type: "array",
      description:
        "Dersom du kunn ønsker at det skal være ett nivå, legg til ett objekt. Om du ønsker flere nivå, f.eks. gull, sølv og bronsje, kan du legge til flere objekt.",
      of: [defineArrayMember({ type: "trophy" })],
      options: { sortable: true },
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "baseImage",
      count: "trophies.length",
    },
    prepare({ title, media, count }) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: title ?? "Trofé-side",
        subtitle: typeof count === "number" ? `${count} trofé(er)` : "Ingen troféer enda",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        media,
      };
    },
  },
});
