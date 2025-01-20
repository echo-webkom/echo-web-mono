import { CalendarIcon } from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type SlugSchemaType,
  type SlugSourceContext,
} from "sanity";
import slugify from "slugify";

import { HAPPENING_TYPES } from "@echo-webkom/lib";

export default defineType({
  name: "repeatingHappening",
  title: "Gjentakende hendelse",
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
      name: "happeningType",
      title: "Type",
      type: "string",
      options: {
        list: HAPPENING_TYPES.filter((type) => type.value !== "bedpres"),
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
      name: "location",
      title: "Sted",
      type: "reference",
      to: { type: "location" },
    }),
    defineField({
      name: "cost",
      title: "Betaling",
      description: "Hvor mye det koster å delta på arrangementet.",
      type: "number",
    }),
    defineField({
      name: "dayOfWeek",
      title: "Dag",
      description: "Dag arrangementet gjentar seg",
      type: "number",
      options: {
        list: [
          {
            title: "Mandag",
            value: 1,
          },
          {
            title: "Tirsdag",
            value: 2,
          },
          {
            title: "Onsdag",
            value: 3,
          },
          {
            title: "Torsdag",
            value: 4,
          },
          {
            title: "Fredag",
            value: 5,
          },
          {
            title: "Lørdag",
            value: 6,
          },
          {
            title: "Søndag",
            value: 0,
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startTime",
      title: "Starttid",
      description: "Tid for når arrangementet starter",
      type: "ttime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "Sluttid",
      description: "Tid for når arrangementet slutter",
      type: "ttime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Dato",
      description: "Dato og tid for arrangementet",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "Sluttdato",
      description: "Dato og tid for når arrangementet slutter",
      type: "date",
      validation: (Rule) => Rule.min(Rule.valueOfField("date")).required(),
    }),
    defineField({
      name: "interval",
      title: "Intervall",
      description: "Hvor ofte arrangementet gjentar seg",
      type: "string",
      options: {
        list: [
          {
            title: "Daglig",
            value: "daily",
          },
          {
            title: "Ukentlig",
            value: "weekly",
          },
          {
            title: "Annenhver uke",
            value: "bi-weekly",
          },
          {
            title: "Månedlig",
            value: "monthly",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ignoredDates",
      title: "Unntaksdatoer",
      description: "Datoer arrangementet ikke holdes (f.eks helligdager)",
      type: "array",
      of: [
        defineArrayMember({
          type: "date",
          name: "ignoredDate",
          title: "Dato",
        }),
      ],
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
