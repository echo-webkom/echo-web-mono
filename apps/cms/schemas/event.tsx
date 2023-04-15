import {OkHandIcon} from "@sanity/icons";
import {
  defineArrayMember,
  defineField,
  defineType,
  type SlugSchemaType,
  type SlugSourceContext,
} from "sanity";
import slugify from "slugify";

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
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        slugify: async (input: string, _schemaType: SlugSchemaType, context: SlugSourceContext) => {
          const slug = slugify(input, {remove: /[*+~.()'"!:@]/g, lower: true, strict: true});
          const query =
            'count(*[_type == "bedpres" || _type == "event" && slug.current == $slug]{_id})';
          const params = {slug};
          const {getClient} = context;

          const count: number = await getClient({apiVersion: "2021-04-10"}).fetch(query, params);
          return count > 0 ? `${slug}-${count + 1}` : slug;
        },
      },
      readOnly: ({currentUser}) => {
        return !!currentUser?.roles.find((role) => role.name === "admin");
      },
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dates",
      title: "Datoer",
      type: "registrationDates",
      validation: (Rule) => Rule.required(),
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
