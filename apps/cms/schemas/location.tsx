import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Sted",
  type: "document",
  icon: PinIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn / Addresse",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lenke til kart",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
