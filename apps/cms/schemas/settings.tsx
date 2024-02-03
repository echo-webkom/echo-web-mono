import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Innstillinger",
  type: "document",
  description: "Innstillinger for nettsiden",
  fields: [
    defineField({
      name: "banner",
      title: "Banner",
      type: "banner",
    }),
  ],
});
