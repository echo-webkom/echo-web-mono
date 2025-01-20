import { defineField, defineType } from "sanity";

export default defineType({
  // Use "ttime", since "time" is a reserved schema type in Sanity
  name: "ttime",
  title: "Tid",
  type: "object",
  options: {
    columns: 2,
  },
  fields: [
    defineField({
      name: "hour",
      title: "Time",
      type: "number",
      validation: (Rule) => Rule.required(),
      options: {
        list: Array.from({ length: 24 }, (_, i) => ({
          title: i.toString().padStart(2, "0"),
          value: i,
        })),
      },
    }),
    defineField({
      name: "minute",
      title: "Minutt",
      type: "number",
      validation: (Rule) => Rule.required(),
      options: {
        list: Array.from({ length: 60 }, (_, i) => ({
          title: i.toString().padStart(2, "0"),
          value: i,
        })),
      },
    }),
  ],
});
