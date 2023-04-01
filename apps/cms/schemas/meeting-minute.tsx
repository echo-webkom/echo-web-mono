import {DocumentIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "meetingMinute",
  title: "Møtereferat",
  icon: DocumentIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      description: "Tittel på møtereferatet",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Dato",
      description: "Dato for møtet",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isAllMeeting",
      title: "Er det et allmøte?",
      type: "boolean",
      options: {
        layout: "checkbox",
      },
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "document",
      title: "Dokument",
      description: "PDF-dokumentet med møtereferatet",
      type: "file",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
