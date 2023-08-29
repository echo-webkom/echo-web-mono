import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "profile",
  title: "Profil",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socials",
      title: "Kontaktinformasjon",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "E-post",
          type: "string",
          validation: (Rule) =>
            Rule.custom((url) => {
              if (!url) {
                return true;
              }

              const emailRegex = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/;
              if (url && emailRegex.test(url)) {
                return true;
              }

              return "Må være en gyldig e-postadresse";
            }),
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          description:
            "URL til LinkedIn-profilen. Eksempel: https://www.linkedin.com/in/{profilnavn}",
          type: "url",
          validation: (Rule) =>
            Rule.custom((url) => {
              if (!url) {
                return true;
              }

              const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
              if (url && linkedinRegex.test(url)) {
                return true;
              }

              return "Må være en gyldig LinkedIn-profil";
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "picture",
    },
  },
});
