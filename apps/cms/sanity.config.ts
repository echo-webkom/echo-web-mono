import { colorInput } from "@sanity/color-input";
import { RobotIcon, RocketIcon, TerminalIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { singletonTools } from "sanity-plugin-singleton-tools";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { deskStructure } from "./src/desk-structure";

const IS_DEV = process.env.NODE_ENV === "development";

const baseConfig = {
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(),
    media(),
    markdownSchema(),
    colorInput(),
    singletonTools(),
  ],
  schema: {
    types: schemaTypes,
  },
  projectId: "pgq2pd26",
};

const prodConfig = defineConfig({
  ...baseConfig,

  name: "production",
  title: "echo web",
  icon: RocketIcon,

  basePath: "/prod",
  dataset: "production",
});

const devConfig = defineConfig({
  ...baseConfig,

  name: "develop",
  title: "echo web – Utvikling",
  icon: TerminalIcon,

  basePath: "/dev",
  dataset: "develop",
});

const testConfig = defineConfig({
  ...baseConfig,

  name: "testing",
  title: "echo web – Testing",
  icon: RobotIcon,

  basePath: "/test",
  dataset: "testing",
});

const getConfig = () => {
  if (IS_DEV) {
    return [devConfig, testConfig, prodConfig];
  }

  return [prodConfig];
};

export default defineConfig(getConfig());
