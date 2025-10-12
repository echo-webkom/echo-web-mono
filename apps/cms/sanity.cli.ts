import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "pgq2pd26",
    dataset: "production",
  },
  deployment: {
    appId: "93dce57be57512d8cd4d7a5c",
    autoUpdates: true,
  },
});
