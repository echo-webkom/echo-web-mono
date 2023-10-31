import { expect, test } from "@playwright/test";

test("login", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Logg inn" }).nth(0).click();

  await expect(page.getByRole("button", { name: "Logg inn med Feide" })).toBeVisible();

  await page.getByRole("banner").getByRole("link", { name: "Logg inn" }).click();
  await page.getByRole("button", { name: "Logg inn med Feide" }).click();

  await page.getByLabel("Feide test users").click();

  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("asbjorn_elevg");
  await page.getByLabel("Password", { exact: true }).click();
  await page.getByLabel("Password", { exact: true }).fill("1qaz");

  await page.getByRole("button", { name: "Log in" }).click();
});
