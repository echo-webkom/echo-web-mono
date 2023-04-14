import {expect, test} from "@playwright/test";

test("has events", async ({page}) => {
  await page.goto("http://localhost:3001");

  await expect(page).toHaveTitle("echo Webkom docs | echo Webkom");
});
