import {expect, test} from "@playwright/test";

test("has events", async ({page}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("echo - Linjeforeningen for informatikk");
});
