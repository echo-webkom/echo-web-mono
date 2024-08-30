import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
    trace: "on-first-retry",
    headless: !!process.env.CI,
    baseURL: "http://127.0.0.1:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "pnpm --filter=web run start",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      cwd: "../",
    },
    {
      command: "pnpm --filter=ars run start",
      url: "http://127.0.0.1:4444",
      reuseExistingServer: !process.env.CI,
      cwd: "../",
    },
  ],
});
