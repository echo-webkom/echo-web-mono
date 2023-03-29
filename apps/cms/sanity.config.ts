import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {deskTool} from "sanity/desk";

import {schemaTypes} from "./schemas";

export default defineConfig({
  name: "default",
  title: "cms",

  projectId: "nnumy1ga",
  dataset: "production",

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
