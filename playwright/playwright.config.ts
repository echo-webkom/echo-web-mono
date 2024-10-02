import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: "html",
  workers: process.env.CI ? 1 : undefined,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "pnpm run start",
      cwd: "../apps/web",
      url: "http://localhost:3000",
      reuseExistingServer: !isCI,
    },
    {
      command: "pnpm run start",
      cwd: "../apps/api",
      url: "http://localhost:8000",
      reuseExistingServer: !isCI,
      stdout: "pipe",
    },
  ],

  use: {
    headless: isCI,
    baseURL: "http://localhost:3000",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    timezoneId: "Europe/Oslo",
  },
});
