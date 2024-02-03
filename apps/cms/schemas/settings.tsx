import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner", 
  title: "Banner",
  type: "document",
  fields: [
    defineField({
      name: "showBanner",
      title: "Vis banner",
      type: "boolean",
      initialValue: true,
      options: {
        layout: "checkbox",
      },
    }),
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
  ],
});
