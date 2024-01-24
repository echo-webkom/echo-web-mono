import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
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
    /* Test against desktop viewports. */
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Commented out because of problems in CI
    // {
    //   name: "Mobile Safari",
    //   use: { ...devices["iPhone 12"] },
    // },
  ],

  webServer: [
    {
      command: "pnpm --filter=web run start",
      url: "http://localhost:3000",
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: "../",
    },
    {
      command: "pnpm --filter=docs run start",
      url: "http://localhost:3001",
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      cwd: "../",
    },
  ],
});
