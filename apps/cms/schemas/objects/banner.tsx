import { ValidationContext, defineField, defineType } from "sanity";

type BannerDocument = {
  showBanner: boolean;
  title?: string;
  subtitle?: string;
  link?: string;
};

export default defineType({
  name: "banner",
  title: "Banner",
  type: "object",
  fields: [
    defineField({
      name: "showBanner",
      title: "Vis banner",
      type: "boolean",
      initialValue: true,
      options: {
        layout: "checkbox",
      },
    }),
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const banner: BannerDocument = (context as ValidationContext & { banner: BannerDocument }).banner;
          if (banner.showBanner === true && !value) {
            return 'Title is required when showBanner is checked';
          }
          return true;
        }),
    }),
    defineField({
      name: "subtitle",
      title: "Undertittel",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Lenke",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string | undefined }) {
      return {
        title: title ?? "Banner",
      };
    },
  },
});
