import { RocketIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./src/sanity/desk-structure";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "production",
  title: "echo web",
  icon: RocketIcon,
  projectId: "pgq2pd26",

  dataset: "production",
  basePath: "/studio",
  studioPath: "/studio",

  plugins: [
    structureTool({
      structure: (S) => deskStructure(S),
    }),
    visionTool(),
    media(),
    markdownSchema(),
  ],

  schema: { types: schemaTypes },
});
