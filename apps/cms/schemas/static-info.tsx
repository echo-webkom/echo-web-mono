import {DocumentTextIcon} from "@sanity/icons";
import {defineField} from "sanity";

const PAGE_TYPES = [
  {title: "Om oss", value: "ABOUT"},
  {title: "For studenter", value: "STUDENTS"},
  {title: "For bedrifter", value: "COMPANIES"},
];

export default defineField({
  name: "static",
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
        list: PAGE_TYPES,
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
    prepare({title, subtitle}: {title: string; subtitle: string}) {
      return {
        title,
        subtitle: PAGE_TYPES.find((type) => type.value === subtitle)?.title,
      };
    },
  },
});
