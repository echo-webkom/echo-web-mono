import {UsersIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

const GROUP_TYPES = [
  {title: "Hovedstyre", value: "board"},
  {title: "Undergruppe", value: "subgroup"},
  {title: "Underorganisasjon", value: "suborg"},
  {title: "Interessegruppe", value: "intgroup"},
];

export default defineType({
  name: "studentGroup",
  title: "Studentgruppe",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Navn",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "groupType",
      title: "Gruppetype",
      type: "string",
      options: {
        list: GROUP_TYPES,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "members",
      title: "Medlemmer",
      type: "array",
      of: [
        {
          type: "object",
          name: "member",
          fields: [
            defineField({
              name: "profile",
              title: "Profil",
              type: "reference",
              to: {type: "profile"},
            }),
            defineField({
              name: "role",
              title: "Rolle",
              type: "string",
            }),
          ],
          preview: {
            select: {
              media: "profile.picture",
              title: "profile.name",
              subtitle: "role",
            },
          },
        },
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
