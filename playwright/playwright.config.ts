import * as os from "os";
import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: os.cpus().length - 1,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    headless: !!process.env.CI,
    baseURL: "http://localhost:3000",
  },

  projects: [
    /* Test against desktop viewports. */
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "pnpm --filter=web start",
    port: 3000,
    cwd: "../",
  },
});
