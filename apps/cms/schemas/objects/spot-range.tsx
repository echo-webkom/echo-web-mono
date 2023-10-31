import { ComponentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "spotRange",
  title: "plasser",
  type: "object",
  fields: [
    defineField({
      name: "minYear",
      title: "Minste trinn",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "maxYear",
      title: "Største trinn",
      type: "number",
      validation: (Rule) => Rule.required().min(Rule.valueOfField("minYear")).max(5),
    }),
    defineField({
      name: "spots",
      title: "Antall plasser",
      description: "Skriv '0' hvis ubegrenset antall plasser er ønsket",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      minYear: "minYear",
      maxYear: "maxYear",
      spots: "spots",
    },
    prepare({ minYear, maxYear, spots }) {
      return {
        title: `${minYear}. - ${maxYear}. trinn`,
        subtitle: `${spots === 0 ? "Ubegrenset" : spots} plasser`,
        media: ComponentIcon,
      };
    },
  },
});
