import { StarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "trophy",
  title: "Trofeer",
  type: "document",
  description: "Bare lov for Webkom å endre!!! Kontakt oss for ideer eller spørsmål!!",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trophyLevels",
      title: "Trofe nivåer",
      type: "array",
      of: [
        defineArrayMember({
          name: "level",
          title: "Trofenivå",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Bilde",
              type: "image",
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Navn",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "text",
              title: "Tekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "threshold",
              title: "Antall nødvendig for å ha trofeen",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
