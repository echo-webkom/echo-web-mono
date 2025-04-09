import { InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Forsidebanner",
  description: "Banner som vises øverst på forsiden",
  icon: InfoOutlineIcon,
  type: "document",
  options: {
    // @ts-expect-error custom option
    singleton: true,
  },
  preview: {
    select: {
      title: "text",
    },
  },
  fields: [
    defineField({
      name: "text",
      title: "Bannertekst",
      validation: (Rule) => Rule.required(),
      type: "string",
    }),
    defineField({
      name: "expiringDate",
      title: "Utløpsdato",
      validation: (Rule) => Rule.required(),
      type: "datetime",
    }),
    defineField({
      name: "backgroundColor",
      title: "Bakgrunnsfarge",
      type: "color",
    }),
    defineField({
      name: "textColor",
      title: "Tekstfarge",
      type: "color",
    }),
    defineField({
      name: "linkTo",
      title: "Lenke til intern/ekstern side",
      type: "string",
    }),
  ],
});
