import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: "html",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "pnpm --filter=web run dev",
      url: "http://localhost:3000",
      timeout: 120 * 1000,
      reuseExistingServer: !isCI,
      cwd: "../",
    },
    {
      command: "pnpm --filter=api run dev",
      url: "http://localhost:8000",
      timeout: 120 * 1000,
      reuseExistingServer: !isCI,
      cwd: "../",
    },
  ],

  use: {
    trace: "on-first-retry",
    video: isCI ? "retain-on-failure" : "on",
    headless: isCI,
    baseURL: "http://localhost:3000",
  },
});
