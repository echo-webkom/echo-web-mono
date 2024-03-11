import { defineField, defineType } from "sanity";

export default defineType({
  name: "movie",
  title: "Film",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato og tid for film",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lenke til IMDb",
      type: "url",
      validation: (Rule) =>
        Rule.custom((link) => {
          if (link?.startsWith("https://www.imdb.com/title")) return true;
          return "Lenken må være fra IMDb";
        }),
    }),
  ],
});
