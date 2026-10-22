import { StarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "trophy",
  title: "Trofeer",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "trophies",
      title: "Trofeer",
      type: "array",
      of: [
        defineArrayMember({
          name: "trophyType",
          title: "Trofe",
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
              name: "text",
              title: "Tekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount_needed",
              title: "Antall nødvendig",
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
