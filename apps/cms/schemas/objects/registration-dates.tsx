import { defineField, defineType } from "sanity";

export default defineType({
  name: "registrationDates",
  title: "Påmeldingsfrister",
  type: "object",
  fields: [
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato og tid for bedriftspresentasjonen",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "registrationStart",
      title: "Påmeldingsdato",
      description: "Dato og tid for påmelding til bedriftspresentasjonen",
      type: "datetime",
      validation: (Rule) => Rule.max(Rule.valueOfField("registrationEnd")),
    }),
    defineField({
      name: "registrationEnd",
      title: "Påmeldingsfrist",
      description: "Dato og tid for påmeldingsfrist til bedriftspresentasjonen",
      type: "datetime",
      validation: (Rule) =>
        Rule.min(Rule.valueOfField("registrationStart")).max(Rule.valueOfField("date")),
    }),
  ],
});
