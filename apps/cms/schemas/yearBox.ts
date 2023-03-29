import {defineType} from "sanity";

export default defineType({
  name: "yearBox",
  type: "document",
  fields: [
    {
      name: "years",
      type: "object",
      fields: [
        {
          name: "1",
          type: "boolean",
        },
        {
          name: "2",
          type: "boolean",
        },
        {
          name: "3",
          type: "boolean",
        },
        {
          name: "4",
          type: "boolean",
        },
        {
          name: "5",
          type: "boolean",
        },
      ],
      options: {
        layout: "grid",
      },
    },
  ],
});
