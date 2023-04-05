import {CaseIcon} from "@sanity/icons";
import {defineArrayMember, defineField, defineType} from "sanity";

const JOB_TYPES = [
  {title: "Fulltid", value: "fulltime"},
  {title: "Deltid", value: "parttime"},
  {title: "Internship", value: "internship"},
  {title: "Sommerjobb", value: "summerjob"},
];

const YEARS = [
  {title: "1. året", value: "FIRST"},
  {title: "2. året", value: "SECOND"},
  {title: "3. året", value: "THIRD"},
  {title: "4. året", value: "FOURTH"},
  {title: "5. året", value: "FIFTH"},
];

export default defineType({
  name: "job",
  title: "Stillingsannonse",
  type: "document",
  icon: CaseIcon,
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
      name: "company",
      title: "Selskap",
      type: "reference",
      to: {type: "company"},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locations",
      title: "Sted(er)",
      type: "array",
      of: [defineArrayMember({type: "reference", to: {type: "location"}})],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "jobType",
      title: "Stillingstype",
      type: "string",
      options: {
        list: JOB_TYPES,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lenke til søknad",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deadline",
      title: "Søknadsfrist",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degreeYears",
      type: "object",
      title: "Aktuelle årstrinn",
      fields: YEARS.map((year) =>
        defineField({
          name: year.value,
          title: year.title,
          type: "boolean",
          initialValue: false,
          options: {
            layout: "checkbox",
          },
        }),
      ),
    }),
    defineField({
      name: "body",
      title: "Brødtekst",
      type: "localeMarkdown",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
