import { defineField, defineType } from "sanity";

export default defineType({
  name: "trophy",
  title: "Trofé",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Bilde",
      type: "image",
      description: "Last opp et bilde for dette spesifikke trofeet.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      description: "Fyll inn en spesifikk tittel til dette troféet",
      placeholder: "F.eks. 'Øvelseskjøring' eller 'Sølv gokart'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivelse",
      type: "text",
      rows: 3,
      placeholder:
        "F.eks 'Du har vært med på ett arrangement, bli med ett til for å få gull trofé.'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "level",
      title: "Nivå",
      type: "number",
      description:
        "Talled du gir til nivå vil ikke ha noe å si. Om du ønske flere nivå, betyr lavere tall lavere nivå.",
      placeholder: "1",
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: { title: "title", media: "image", level: "level" },
    prepare({ title, media, level }) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: title ?? "Uten tittel",
        subtitle: level ? `Nivå ${level}` : "Uten nivå",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        media,
      };
    },
  },
});
