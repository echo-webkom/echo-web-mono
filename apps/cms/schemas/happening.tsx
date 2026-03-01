import { CalendarIcon } from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type SlugSchemaType,
  type SlugSourceContext,
} from "sanity";
import slugify from "slugify";

import { HAPPENING_TYPES, type HappeningType } from "@echo-webkom/lib";

export default defineType({
  name: "happening",
  title: "Hendelse",
  type: "document",
  icon: CalendarIcon,
  preview: {
    select: {
      title: "title",
      type: "happeningType",
    },
    prepare: ({ title, type }) => {
      const typeTitle = HAPPENING_TYPES.find(
        (happeningType) => happeningType.value === type,
      )?.title;
      return {
        title: `${title}`,
        subtitle: typeTitle,
      };
    },
  },
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
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        slugify: async (input: string, _schemaType: SlugSchemaType, context: SlugSourceContext) => {
          const slug = slugify(input, { remove: /[*+~.()'"!:@]/g, lower: true, strict: true });
          const query = 'count(*[_type == "happening" && slug.current == $slug]{_id})';
          const params = { slug };
          const { getClient } = context;

          const count: number = await getClient({ apiVersion: "2021-04-10" }).fetch(query, params);
          return count > 0 ? `${slug}-${count + 1}` : slug;
        },
      },
      readOnly: ({ currentUser }) => {
        return !!currentUser?.roles.find((role) => role.name === "admin");
      },
    }),
    defineField({
      name: "isPinned",
      title: "Pinnet",
      type: "boolean",
      description: "Om hendelsen skal være pinnet på forsiden",
      initialValue: false,
      /**
       *  Is has to be set to a false, but must be false if there are
       *  already 4 other happenings pinned.
       */
      validation: (Rule) =>
        Rule.custom(async (isPinned, context) => {
          const pinnedEvents = await context
            .getClient({ apiVersion: "2021-04-10" })
            .fetch<Array<{ _id: string }>>(`*[_type == "happening" && isPinned == true] { _id }`);
          return pinnedEvents.length < 5 || !isPinned || "Det kan bare være 4 pinnete hendelser";
        }),
      options: {
        layout: "switch",
      },
    }),
    defineField({
      name: "happeningType",
      title: "Type",
      type: "string",
      options: {
        // @ts-expect-error sanity
        list: HAPPENING_TYPES,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organizers",
      title: "Arrangør",
      description:
        "Hvem som arrangerer arrangementet. Medlemmer av gruppene vil få tilgang til påmeldingssiden.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: { type: "studentGroup" },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((organizers, context) => {
          if (organizers?.length === 0 && context.document?.happeningType !== "external") {
            return "Arrangementer må ha minst en arrangør.";
          }

          return true;
        }),
    }),
    defineField({
      name: "company",
      title: "Selskap",
      type: "reference",
      to: { type: "company" },
      hidden: ({ document }) =>
        // @ts-expect-error sanity
        !(["bedpres", "external"] satisfies Array<HappeningType>).includes(document?.happeningType),
      validation: (Rule) =>
        Rule.custom((company, context) => {
          if (context.document?.happeningType === "bedpres" && !company) {
            return "Bedriftspresentasjoner må ha et selskap knyttet til seg.";
          }

          return true;
        }),
    }),
    defineField({
      name: "location",
      title: "Sted",
      type: "reference",
      description:
        "Hvor arrangementet skal finne sted. Arrangementer på 'Programmerbar' vil også vises på programmer.bar.",
      to: { type: "location" },
    }),
    defineField({
      name: "cost",
      title: "Betaling",
      description: "Hvor mye det koster å delta på arrangementet.",
      type: "number",
    }),
    defineField({
      name: "hideRegistrations",
      title: "Skjul påmelding",
      type: "boolean",
      description: "Skjul hvem som er påmeldt for arrangementet.",
      initialValue: false,
      options: {
        layout: "switch",
      },
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato og tid for arrangementet",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato",
      description: "Dato og tid for når arrangementet slutter",
      type: "datetime",
      validation: (Rule) => Rule.min(Rule.valueOfField("date")),
    }),
    defineField({
      name: "registrationStartGroups",
      title: "Påmeldingsdato for undergrupper",
      description:
        "Dato og tid for når undergrupper kan melde seg på hendelsen. Hvis ikke satt, vil påmeldingsdatoen være den samme som for resten. Kan ikke være etter vanlig påmeldingsdato.",
      type: "datetime",
    }),
    defineField({
      name: "registrationGroups",
      title: "Undergrupper",
      description: "Hvilke undergrupper som kan melde seg på med påmeldingsdato for undergrupper.",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "studentGroup" },
        },
      ],
      hidden: ({ document }) => !document?.registrationStartGroups,
    }),
    defineField({
      name: "registrationStart",
      title: "Påmeldingsdato",
      description: "Dato og tid for påmelding til hendelsen.",
      type: "datetime",
      validation: (Rule) =>
        Rule.custom((registrationStart, context) => {
          const registrationEnd = context.document?.registrationEnd;
          if (registrationStart && !registrationEnd) {
            return "Påmeldingsfrist må settes hvis påmeldingsdato er satt.";
          }
          if (!registrationStart && registrationEnd) {
            return "Påmeldingsdato må settes hvis påmeldingsfrist er satt.";
          }
          return true;
        }),
    }),
    defineField({
      name: "registrationEnd",
      title: "Påmeldingsfrist",
      description: "Dato og tid for påmeldingsfrist til hendelsen.",
      type: "datetime",
      validation: (Rule) =>
        Rule.custom((registrationEnd, context) => {
          const registrationStart = context.document?.registrationStart;
          if (registrationStart && !registrationEnd) {
            return "Påmeldingsfrist må settes hvis påmeldingsdato er satt.";
          }
          if (!registrationStart && registrationEnd) {
            return "Påmeldingsdato må settes hvis påmeldingsfrist er satt.";
          }
          return true;
        }).min(Rule.valueOfField("registrationStart")),
    }),
    defineField({
      name: "contacts",
      title: "Kontaktpersoner",
      description:
        "Hvem som skal kontaktes for påmelding/avmelding og annen informasjon om hendelsen.",
      type: "array",
      of: [
        defineArrayMember({
          name: "contact",
          title: "Kontaktperson",
          type: "contactProfile",
        }),
      ],
    }),
    defineField({
      name: "spotRanges",
      title: "Arrangementsplasser",
      description: "Hvor mange plasser som er tildelt hvert trinn på hendelsen.",
      type: "array",
      of: [
        defineArrayMember({
          name: "spotRange",
          title: "Plasser",
          type: "spotRange",
        }),
      ],
      validation: (Rule) =>
        Rule.custom(
          (value: Array<{ minYear: number; maxYear: number; _key: string }> | undefined) => {
            const spotRanges = value ?? [];
            const invalidSpotranges = spotRanges.filter((spotRange1) => {
              return spotRanges.some((spotRange2) => {
                const smallest = spotRange1.maxYear < spotRange2.maxYear ? spotRange1 : spotRange2;
                const biggest = spotRange1.maxYear < spotRange2.maxYear ? spotRange2 : spotRange1;

                if (smallest.maxYear === biggest.maxYear) {
                  return false;
                }

                const isPartialOverlap =
                  smallest.minYear < biggest.minYear && biggest.minYear <= smallest.maxYear;

                return isPartialOverlap;
              });
            });

            const invalidPaths = invalidSpotranges.map((spotRange, index) =>
              spotRange._key ? [{ _key: spotRange._key }] : [index],
            );
            return invalidSpotranges.length === 0
              ? true
              : { message: "Ugyldige plasser", paths: invalidPaths };
          },
        ),
    }),
    defineField({
      name: "additionalQuestions",
      title: "Tillegsspørsmål",
      description: "Spørsmål som skal stilles til de som melder seg på arrangementet.",
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
      name: "externalLink",
      type: "url",
      hidden: ({ document }) => document?.happeningType !== "external",
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "markdown",
    }),
  ],
});
