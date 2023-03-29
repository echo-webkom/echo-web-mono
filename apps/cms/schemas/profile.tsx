import {UserIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

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
      options: {hotspot: true},
    }),
    defineField({
      name: "socials",
      title: "Kontaktinformasjon",
      type: "document",
      fields: [
        defineField({
          name: "email",
          title: "E-post",
          type: "string",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
