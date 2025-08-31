import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactProfile",
  title: "Kontaktprofil",
  type: "object",
  fields: [
    defineField({
      name: "profile",
      title: "Profil",
      type: "reference",
      to: { type: "profile" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "E-post",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .email()
          .custom((email) => {
            if (Array.from("æøå").some((char) => email?.includes(char))) {
              return "E-postadressen kan ikke inneholde æ, ø eller å.";
            }

            return true;
          }),
    }),
  ],
  preview: {
    select: {
      media: "profile.picture",
      title: "profile.name",
      subtitle: "email",
    },
  },
});
