import { BellIcon } from "@sanity/icons";
import {
  defineField,
  defineType,
} from "sanity";

export default defineType({
  name: "notification",
  title: "Notifikasjoner",
  type: "document",
  icon: BellIcon,
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
      name: "body",
      title: "Brødtekst",
      description:
        "Innholdet på siden. Ikke bruk overskrifter her. Vi bruker h1-overskrifter fra tittelen. Bruker heller h2 (##).",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "banner",
      title: "Banner",
      type: "banner",
    }),
  ]
});