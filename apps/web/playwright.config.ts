import {defineConfig, devices} from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    headless: !!process.env.CI || !!process.env.PLAYWRIGHT_HEADLESS,
    baseURL,
  },

  projects: [
    /* Test against desktop viewports. */
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]},
    },

    {
      name: "firefox",
      use: {...devices["Desktop Firefox"]},
    },

    {
      name: "webkit",
      use: {...devices["Desktop Safari"]},
    },

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      use: {...devices["Pixel 5"]},
    },
    {
      name: "Mobile Safari",
      use: {...devices["iPhone 12"]},
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
