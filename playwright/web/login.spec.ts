import {expect, test} from "@playwright/test";

test("test", async ({page}) => {
  await page.goto("/");
  await page.getByRole("link", {name: "Logg inn"}).click();

  await expect(page.getByRole("button", {name: "Logg inn med Feide"})).toBeVisible();
});
