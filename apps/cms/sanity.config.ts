import { colorInput } from "@sanity/color-input";
import { RobotIcon, RocketIcon, TerminalIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { type Config } from "sanity";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { singletonTools } from "sanity-plugin-singleton-tools";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemas";
import { deskStructure } from "./src/desk-structure";

// TODO: Type configs using `Config` and or `defineConfig()`

const defaultConfig = {
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

const prodConfig = {
  ...defaultConfig,

  name: "production",
  title: "echo web",
  icon: RocketIcon,

  basePath: "/prod",
  dataset: "production",
};

const devConfig = {
  ...defaultConfig,

  name: "develop",
  title: "echo web – Utvikling",
  icon: TerminalIcon,

  basePath: "/dev",
  dataset: "develop",
};

const testConfig = {
  ...defaultConfig,

  name: "testing",
  title: "echo web – Testing",
  icon: RobotIcon,

  basePath: "/test",
  dataset: "testing",
};

const getConfig = () => {
  if (process.env.NODE_ENV === "development") {
    return [prodConfig, devConfig, testConfig];
  }

  return [prodConfig];
};

export default getConfig() as Array<Config>;
