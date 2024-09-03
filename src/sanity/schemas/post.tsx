import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
      name: "authors",
      title: "Forfattere",
      type: "array",
      of: [{ type: "reference", to: [{ type: "studentGroup" }, { type: "profile" }] }],
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
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      author0: "authors.0.name",
      author1: "authors.1.name",
      author2: "authors.2.name",
      author3: "authors.3.name",
    },
    prepare: ({
      title,
      author0,
      author1,
      author2,
      author3,
    }: {
      title: string;
      author0: string;
      author1: string;
      author2: string;
      author3: string;
    }) => {
      const authors = [author0, author1, author2].filter(Boolean);
      const subtitle = authors.length > 0 ? `av ${authors.join(", ")}` : "";
      const hasMoreAuthors = Boolean(author3);

      return {
        title,
        subtitle: hasMoreAuthors ? `${subtitle}…` : subtitle,
      };
    },
  },
});
