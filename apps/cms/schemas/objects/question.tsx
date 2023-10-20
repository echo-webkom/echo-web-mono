import { InfoOutlineIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "question",
  title: "Spørsmål",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Spørsmål",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Er dette et obligatorisk spørsmål?",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Spørsmålstype",
      type: "string",
      options: {
        list: [
          { title: "Tekstfelt", value: "text" },
          { title: "Stort tekstfelt", value: "textarea" },
          { title: "Sjekkbokser", value: "checkbox" },
          { title: "Valg", value: "radio" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "options",
      title: "Alternativer",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      hidden: ({ parent }) => ["text", "textarea"].includes(parent?.type),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const options = value ?? [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const questionType = context.parent.type as string;

          if (["checkbox", "radio"].includes(questionType) && options.length < 2) {
            return "Flervalg må ha minst to alternativer";
          }

          if (["text", "textarea"].includes(questionType) && options.length > 0) {
            return "Tekstfelt kan ikke ha alternativer";
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title as string,
        media: InfoOutlineIcon,
      };
    },
  },
});
