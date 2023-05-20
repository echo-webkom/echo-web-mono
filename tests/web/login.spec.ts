import {expect, test} from "@playwright/test";

test("test", async ({page}) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", {name: "Logg inn"}).click();
  await expect(page.getByRole("button", {name: "Logg inn med Feide"})).toBeVisible();
});
