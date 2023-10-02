import "dotenv/config";

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./{src,tests}/**/*.{test,spec}.{ts,tsx}"],
    environment: "miniflare",
    // environment: "node",
    threads: false,
    coverage: {
      provider: "v8",
      reporter: ["text"],
    },
  },
  plugins: [tsconfigPaths()],
});
