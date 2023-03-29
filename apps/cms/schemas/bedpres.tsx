import {ComponentIcon, PresentationIcon} from "@sanity/icons";
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
      description:
        "Hvem som skal kontaktes for påmelding/avmelding og annen informasjon om bedriftspresentasjonen.",
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
      name: "spotRanges",
      title: "Arrangementsplasser",
      description: "Hvor mange plasser som er tildelt hvert trinn på et arrangement.",
      type: "array",
      of: [
        {
          name: "spotRange",
          title: "plasser",
          type: "object",
          fields: [
            defineField({
              name: "minDegreeYear",
              title: "Minste trinn",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "maxDegreeYear",
              title: "Største trinn",
              type: "number",
              validation: (Rule) => Rule.required().min(Rule.valueOfField("minDegreeYear")).max(5),
            }),
            defineField({
              name: "spots",
              title: "Antall plasser",
              description: "Skriv '0' hvis ubegrenset antall plasser er ønsket",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              minDegreeYear: "minDegreeYear",
              maxDegreeYear: "maxDegreeYear",
              spots: "spots",
            },
            prepare({minDegreeYear, maxDegreeYear, spots}) {
              return {
                title: `${minDegreeYear}. - ${maxDegreeYear}. trinn`,
                subtitle: `${spots === 0 ? "Ubegrenset" : spots} plasser`,
                media: ComponentIcon,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
    }),
  ],
});
