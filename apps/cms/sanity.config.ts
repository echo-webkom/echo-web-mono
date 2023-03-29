import {RobotIcon, RocketIcon, TerminalIcon} from "@sanity/icons";
import {visionTool} from "@sanity/vision";
import {defineConfig, type Config} from "sanity";
import {media} from "sanity-plugin-media";
import {deskTool} from "sanity/desk";

import {schemaTypes} from "./schemas";

const defaultConfig = {
  plugins: [deskTool(), visionTool(), media()],
  schema: {types: schemaTypes},
  projectId: "nnumy1ga",
};

const prodConfig = defineConfig({
  ...defaultConfig,

  name: "production",
  title: "echo web",
  icon: RocketIcon,

  basePath: "/prod",
  dataset: "production",
});

const devConfig = defineConfig({
  ...defaultConfig,

  name: "develop",
  title: "echo web – Utvikling",
  icon: TerminalIcon,

  basePath: "/dev",
  dataset: "develop",
});

const testConfig = defineConfig({
  ...defaultConfig,

  name: "testing",
  title: "echo web – Testing",
  icon: RobotIcon,

  basePath: "/test",
  dataset: "testing",
});

const getConfigs = (): Array<Config> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (import.meta.env.DEV) {
    return [prodConfig, devConfig, testConfig];
  }

  return [prodConfig];
};

export default getConfigs();
