import {ComponentIcon, InfoOutlineIcon, PresentationIcon} from "@sanity/icons";
import {defineArrayMember, defineField, defineType} from "sanity";

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
      name: "additionalQuestions",
      title: "Tillegsspørsmål",
      description:
        "Spørsmål som skal stilles til de som melder seg på arrangementet. Eks. 'Har du noen matprefereanser?'",
      type: "array",
      of: [
        defineArrayMember({
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
                  {title: "Tekstfelt", value: "text"},
                  {title: "Flervalg", value: "multipleChoice"},
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              hidden: ({parent}) => parent.type !== "multipleChoice",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const options = value ?? [];
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const questionType = context.parent.type as string;

                  if (questionType === "multipleChoice" && options.length < 2) {
                    return "Flervalg må ha minst to alternativer";
                  }
                  return true;
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
            prepare({title}) {
              return {
                title: title as string,
                media: InfoOutlineIcon,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
    }),
  ],
});
