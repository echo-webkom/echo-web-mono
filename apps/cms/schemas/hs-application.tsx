import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "hs-application",
  title: "HS Søkere",
  type: "document",
  icon: UserIcon,
  preview: {
    select: {
      title: "profile.name",
      media: "profile.picture",
    },
  },
  fields: [
    defineField({
      name: "profile",
      title: "Profil",
      type: "reference",
      to: { type: "profile" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Plakat",
      type: "file",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
