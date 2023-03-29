import {PresentationIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "bedpres",
  title: "Bedriftspresentasjon",
  type: "document",
  icon: PresentationIcon,
  groups: [
    {
      name: "general",
      title: "Generelt",
    },
    {
      name: "dates",
      title: "Datoer",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      group: "general",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      group: "general",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "company",
      title: "Selskap",
      group: "general",
      type: "reference",
      to: {type: "company"},
    }),
    defineField({
      name: "location",
      title: "Sted",
      group: "general",
      type: "reference",
      to: {type: "location"},
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato for bedriftspresentasjonen",
      group: "dates",
      type: "date",
    }),
    defineField({
      name: "registrationDate",
      title: "Påmeldingsdato",
      description: "Påmeldingsdato for bedriftspresentasjonen",
      group: "dates",
      type: "date",
      validation: (Rule) => Rule.required().max(Rule.valueOfField("registrationDeadline")),
    }),
    defineField({
      name: "registrationDeadline",
      title: "Påmeldingsfrist",
      description: "Påmeldingsfrist for bedriftspresentasjonen",
      group: "dates",
      type: "date",
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField("registrationDate")).max(Rule.valueOfField("date")),
    }),
    defineField({
      name: "contacts",
      title: "Kontaktpersoner",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "profile",
              title: "Profil",
              type: "reference",
              to: {type: "profile"},
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "email",
              title: "E-post",
              type: "string",
              validation: (Rule) => Rule.required().email(),
            }),
          ],
          preview: {
            select: {
              media: "profile.picture",
              title: "profile.name",
              subtitle: "email",
            },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "blockContent",
    }),
  ],
});
