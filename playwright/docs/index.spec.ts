import { expect, test } from "@playwright/test";

test("docs frontpage", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  await expect(page).toHaveTitle("Index - echo Webkom Docs");
});
