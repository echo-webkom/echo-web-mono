import {OkHandIcon} from "@sanity/icons";
import {defineArrayMember, defineField, defineType} from "sanity";

export default defineType({
  name: "event",
  title: "Arrangement",
  type: "document",
  icon: OkHandIcon,
  groups: [{name: "dates", title: "Datoer"}],
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organizer",
      title: "Arrangør",
      description:
        "Hvem som arrangerer arrangementet. Medlemmer av gruppene vil få tilgang til påmeldingssiden.",
      type: "array",
      of: [
        {
          type: "reference",
          to: {type: "studentGroup"},
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contacts",
      title: "Kontaktpersoner",
      description:
        "Hvem som skal kontaktes for påmelding/avmelding og annen informasjon om arrangementet.",
      type: "array",
      of: [
        defineArrayMember({
          name: "contactProfile",
          title: "Kontaktperson",
          type: "contactProfile",
        }),
      ],
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato og tid for arrangementet.",
      group: "dates",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrationDate",
      title: "Påmeldingsdato",
      description: "Dato og tid for påmelding til arrangementet.",
      group: "dates",
      type: "datetime",
      validation: (Rule) => Rule.required().max(Rule.valueOfField("registrationDeadline")),
    }),
    defineField({
      name: "registrationDeadline",
      title: "Påmeldingsfrist",
      description: "Dato og tid for påmelding til arrangementet.",
      group: "dates",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField("registrationDate")).max(Rule.valueOfField("date")),
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "reference",
      to: {type: "location"},
    }),
    defineField({
      name: "spotRanges",
      title: "Arrangementsplasser",
      description: "Hvor mange plasser som er tildelt hvert trinn på et arrangement.",
      type: "array",
      of: [
        defineArrayMember({
          name: "spotRange",
          title: "Plasser",
          type: "spotRange",
        }),
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
          type: "question",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "localeMarkdown",
    }),
  ],
});
