import { colorInput } from "@sanity/color-input";
import { RobotIcon, RocketIcon, TerminalIcon } from "@sanity/icons";
import { visionTool } from "@sanity/vision";
import { type Template } from "sanity";
import { markdownSchema } from "sanity-plugin-markdown";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import {colorInput} from '@sanity/color-input'

import { schemaTypes } from "./schemas";
import { deskStructure } from "./src/desk-structure";

// TODO: Type configs using `Config` and or `defineConfig()`

// Configs for singleton
const singletonActions = new Set(["publish", "discardChanges", "restore"]);
const singletonTypes = new Set(["banner"]);

const defaultConfig = {
  plugins: [
    structureTool({
      structure: (S) => deskStructure(S),
    }),
    visionTool(),
    media(),
    markdownSchema(),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates: Template[]) =>
      templates.filter(({ schemaType }: any) => !singletonTypes.has(schemaType)),
  },
  projectId: "pgq2pd26",
  document: {
    actions: (input: Array<{ action: string | null }>, context: { schemaType: string }) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
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

export default getConfig();
