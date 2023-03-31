import {ComponentIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "spotRange",
  title: "plasser",
  type: "object",
  fields: [
    defineField({
      name: "minDegreeYear",
      title: "Minste trinn",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "maxDegreeYear",
      title: "Største trinn",
      type: "number",
      validation: (Rule) => Rule.required().min(Rule.valueOfField("minDegreeYear")).max(5),
    }),
    defineField({
      name: "spots",
      title: "Antall plasser",
      description: "Skriv '0' hvis ubegrenset antall plasser er ønsket",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      minDegreeYear: "minDegreeYear",
      maxDegreeYear: "maxDegreeYear",
      spots: "spots",
    },
    prepare({minDegreeYear, maxDegreeYear, spots}) {
      return {
        title: `${minDegreeYear}. - ${maxDegreeYear}. trinn`,
        subtitle: `${spots === 0 ? "Ubegrenset" : spots} plasser`,
        media: ComponentIcon,
      };
    },
  },
});
