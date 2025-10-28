import { InfoOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { HEADER_ICONS } from "@echo-webkom/lib";

export default defineType({
  name: "header",
  title: "Forsideheader",
  icon: InfoOutlineIcon,
  type: "document",
  options: {
    // @ts-expect-error custom option
    singleton: true,
  },
  preview: {
    select: {
      title: "text",
    },
  },
  fields: [
    defineField({
      name: "text",
      title: "Tekst",
      type: "string",
      hidden: true,
      initialValue: "Header på forsiden",
    }),

    defineField({
      name: "content",
      title: "Innhold",
      validation: (Rule) => Rule.required(),
      type: "array",
      of: [{ type: "headerItem" }],
    }),
  ],
});

export const headerItem = defineType({
  name: "headerItem",
  title: "Header element",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Tekst",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isDropdown",
      title: "Er nedtrekksmeny",
      type: "boolean",
      initialValue: false,
    }),

    // Fields for if it is a dropdown
    defineField({
      name: "links",
      title: "Lenker",
      type: "array",
      of: [
        {
          type: "object",
          preview: {
            select: {
              title: "text",
              subtitle: "description",
              icon: "icon",
            },
            prepare: ({ title, subtitle, icon }) => {
              const IconComponent = HEADER_ICONS.find((ic) => ic.value === icon)?.icon;

              return {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/prefer-nullish-coalescing
                title: title || "Ingen tekst",
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                subtitle: subtitle,
                media: IconComponent
                  ? () => <IconComponent style={{ fontSize: "24px" }} />
                  : undefined,
              };
            },
          },
          fields: [
            defineField({
              name: "text",
              title: "Tekst",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "linkTo",
              title: "Lenke til intern/ekstern side",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Beskrivelse",
              type: "text",
            }),
            defineField({
              name: "icon",
              title: "Ikon",
              type: "string",
              options: {
                list: HEADER_ICONS.map((icon) => ({
                  title: icon.title,
                  value: icon.value,
                })),
              },
            }),
          ],
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      hidden: ({ parent }) => !parent?.isDropdown,
    }),

    // Fields for if it is not a dropdown
    defineField({
      name: "linkTo",
      title: "Lenke til intern/ekstern side",
      type: "string",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      hidden: ({ parent }) => parent?.isDropdown,
    }),
  ],
});
