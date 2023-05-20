import {LinkIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "footerLink",
  title: "Footer link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Lenke",
      description: "Lenke til side",
      type: "string",
      validation: (Rule) =>
        Rule.custom((link) => {
          if (
            !link?.startsWith("https://") &&
            !link?.startsWith("http://") &&
            !link?.startsWith("mailto:") &&
            !link?.startsWith("/")
          ) {
            return "En lenke må starte med https://, http://, mailto: eller /.";
          }

          return true;
        }),
    }),
  ],
});
