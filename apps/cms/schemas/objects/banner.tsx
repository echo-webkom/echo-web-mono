import { defineField, defineType } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner",
  type: "object",
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
<<<<<<< HEAD
    defineField({
      name: "link",
      title: "Lenke",
      type: "string",
    }),
=======
 
>>>>>>> da021fab7a8793e569b4ac949b401401985b34be
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string | undefined }) {
      return {
        title: title ?? "Banner",
      };
    },
  },
});
