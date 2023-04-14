import {expect, test} from "@playwright/test";

test("has events", async ({page}) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle("echo – Linjeforeningen for informatikk");
});
