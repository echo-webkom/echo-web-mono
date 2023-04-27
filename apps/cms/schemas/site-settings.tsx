import {CogIcon} from "@sanity/icons";
import {defineField, defineType} from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Innstillinger",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "showBanner",
      title: "Vis banner",
      description: "Kryss av for å vise banneret på nettsiden.",
      type: "boolean",
      initialValue: false,
      options: {
        layout: "checkbox",
      },
    }),
    defineField({
      name: "banner",
      title: "Banner",
      description: "Banneret som vises på nettsiden.",
      type: "banner",
      validation: (Rule) =>
        Rule.custom((banner, context) => {
          if (context.document?.showBanner && !banner) {
            return "Banneret må være satt når det skal vises på nettsiden.";
          }

          return true;
        }),
      hidden: ({document}) => !document?.showBanner,
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Innstillinger",
      media: CogIcon,
    }),
  },
});
