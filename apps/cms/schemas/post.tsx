import {EnvelopeIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "post",
  title: "Innlegg",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "authors",
      title: "Forfattere",
      type: "array",
      of: [{type: "reference", to: [{type: "studentGroup"}, {type: "profile"}]}],
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "blockContent",
    }),
  ],
});
