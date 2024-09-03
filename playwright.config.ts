import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    headless: !!process.env.CI,
    baseURL: "http://localhost:3000",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm run start",
    url: "http://localhost:3000",
    timeout: 120 * 1000,
    reuseExistingServer: !!process.env.CI,
    cwd: "../",
  },
});
