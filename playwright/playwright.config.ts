import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  /**
   * We don't want to run tests in parallel because of possible race conditions.
   *
   * This should be fixed in the future by using a different approach to testing.
   */
  workers: 1,
  fullyParallel: false,

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
    // TODO: Test more viewports.
  ],

  webServer: [
    {
      command: "pnpm --filter=web run start",
      url: "http://localhost:3000",
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: "../",
    },
  ],
});
