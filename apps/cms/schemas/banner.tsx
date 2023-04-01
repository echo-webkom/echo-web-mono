import {InfoOutlineIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Undertittel",
      description: "Ekstra informasjon som vises under tittelen. (Valgfritt)",
      type: "string",
    }),
    defineField({
      name: "expiresAt",
      title: "Utløpsdato",
      description: "Dato og tid for når banneret skal fjernes fra nettsiden. Tom = aldri.",
      type: "datetime",
    }),
    defineField({
      name: "link",
      title: "Lenke",
      description: "Lenke til ekstern side. (Valgfritt)",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({title, subtitle}) {
      return {
        title: title as string,
        subtitle: subtitle as string,
        media: InfoOutlineIcon,
      };
    },
  },
});
