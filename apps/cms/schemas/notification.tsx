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
  preview: {
    select: {
      title: "title",
    },
  },
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
      description: "Her kan det legges inn en bedre og lengre beskrivelse av notifikasjonen.",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Lenke",
      description: "Lenke til et arrangement eller facebook side med mer informasjon.",
      type: "url",
    }),
    defineField({
      name: "publishedAt",
      title: "Publisert",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "validTo",
      title: "Gyldig til",
      description: "Velg hvor lenge notifikasjonen skal være synlig.",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ]
});
