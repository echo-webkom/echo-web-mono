/// <reference types="vitest" />

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
  plugins: [tsconfigPaths()],
});
