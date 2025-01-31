import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "merch",
  title: "Merch",
  description: "Merch siden",
  icon: BasketIcon,
  type: "document",
  options: {
    // @ts-expect-error custom option
    singleton: true,
  },
  preview: {
    select: {
      title: "titel",
    },
  },
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "beskrivelse",
      validation: (Rule) => Rule.required(),
      type: "string",
    }),
    defineField({
      name: "cost",
      title: "Pris",
      description: "Hvor mye koster denne?",
      type: "number",
    }),
    defineField({
      name: "picture",
      title: "Bilde",
      description: "Bilde av produktet",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
