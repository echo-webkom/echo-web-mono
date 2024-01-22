import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // @ts-expect-error IDK
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
  },
});
