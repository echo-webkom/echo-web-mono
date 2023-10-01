import "dotenv/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./{src,tests}/**/*.{test,spec}.{ts,tsx}"],
    environment: "node",
    threads: false,
  },
  plugins: [tsconfigPaths()],
});
