import { DocumentTextIcon } from "@sanity/icons";
import { defineField } from "sanity";

import { PAGE_TYPES } from "@echo-webkom/lib";

export default defineField({
  name: "staticInfo",
  title: "Statiske sider",
  type: "document",
  icon: DocumentTextIcon,
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
      name: "pageType",
      title: "Side type",
      type: "string",
      options: {
        list: PAGE_TYPES.map(({ title, value }) => {
          return { title, value };
        }),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      description:
        "Innholdet på siden. Ikke bruk overskrifter her. Vi bruker h1-overskrifter fra tittelen. Bruker heller h2 (##).",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "pageType",
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title,
        subtitle: PAGE_TYPES.find((type) => type.value === subtitle)?.title,
      };
    },
  },
});
