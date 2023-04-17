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
      validation: (Rule) => Rule.required(),
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
      name: "socials",
      title: "Sosiale medier",
      description: "Legg til lenker til sosiale medier",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "E-post",
          type: "email",
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
          type: "url",
        }),
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
      ],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      hidden: ({parent}) => parent.groupType === "board",
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "localeMarkdown",
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
              media: "profile.image",
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
      name: "name",
      groupType: "groupType",
      image: "image",
    },

    prepare({name, groupType, image}) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: name,
        subtitle: GROUP_TYPES.find((t) => t.value === groupType)?.title,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        media: image,
      };
    },
  },
});
