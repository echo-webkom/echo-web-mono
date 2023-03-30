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
      name: "expiryDate",
      title: "Utløpsdato",
      description: "Dato for når banneret skal fjernes fra nettsiden. Tom = aldri.",
      type: "date",
    }),
    defineField({
      name: "isLink",
      title: "Er lenke",
      description: "Er banneret en lenke?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "link",
      title: "Lenke",
      type: "url",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      hidden: ({parent}) => !parent.isLink,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const isLink = context.parent.isLink as boolean;
          if (isLink && !value) {
            return "Lenke må ha en verdi";
          }
          return true;
        }),
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
