import { BasketIcon } from "@sanity/icons";
import { defineField, defineType, type SlugSchemaType, type SlugSourceContext } from "sanity";
import slugify from "slugify";

export default defineType({
  name: "merch",
  title: "Merch",
  description: "Merch siden",
  icon: BasketIcon,
  type: "document",
  options: {
    // @ts-expect-error custom option
    singleton: true,
  },
  preview: {
    select: {
      title: "titel",
    },
  },
  fields: [
    defineField({
      name: "titel",
      title: "Tittel",
      validation: (Rule) => Rule.required(),
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        slugify: async (input: string, _schemaType: SlugSchemaType, context: SlugSourceContext) => {
          const slug = slugify(input, { remove: /[*+~.()'"!:@]/g, lower: true, strict: true });
          const query = 'count(*[_type == "happening" && slug.current == $slug]{_id})';
          const params = { slug };
          const { getClient } = context;

          const count: number = await getClient({ apiVersion: "2021-04-10" }).fetch(query, params);
          return count > 0 ? `${slug}-${count + 1}` : slug;
        },
      },
      readOnly: ({ currentUser }) => {
        return !!currentUser?.roles.find((role) => role.name === "admin");
      },
    }),
    defineField({
      name: "text",
      title: "beskrivelse",
      validation: (Rule) => Rule.required(),
      type: "string",
    }),
    defineField({
      name: "cost",
      title: "Pris",
      description: "Hvor mye koster denne?",
      type: "number",
    }),
  ],
});
