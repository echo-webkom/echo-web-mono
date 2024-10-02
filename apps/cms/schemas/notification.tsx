import { BellIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "notification",
  title: "Notifikasjon",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "title",
      description: "Maks 100 tegn",
      title: "Notifikasjonstittel",
      type: "string",
      validation: (Rule) => Rule.max(100).required(),
    }),
    defineField({
      name: "dateFrom",
      title: "Dato fra",
      description: "Når skal notifkiasjonen vises?",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dateTo",
      title: "Dato til",
      description: "Når skal notifkiasjonen slutte å vises?",
      type: "datetime",
      validation: (Rule) => Rule.min(Rule.valueOfField("dateFrom")).required(),
    }),
  ],
});
