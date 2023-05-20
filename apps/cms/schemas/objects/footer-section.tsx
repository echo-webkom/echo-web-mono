import {LinkIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "footerSection",
  title: "Footer Seksjon",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Lenker",
      description: "Hvilke lenker denne seksjonen skal inneholde",
      type: "array",
      of: [{type: "footerLink"}],
    }),
  ],
});
