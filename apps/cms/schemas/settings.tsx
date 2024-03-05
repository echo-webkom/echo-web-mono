import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Innstillinger",
  type: "document",
  icon: CogIcon,
  readOnly: ({ currentUser }) => !!currentUser?.roles.find((role) => role.name === "admin"),
  fields: [
    defineField({
      name: "banner",
      title: "Banner",
      type: "banner",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Innstillinger",
    }),
  },
});
