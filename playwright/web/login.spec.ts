import { expect, test } from "@playwright/test";

test("login as non-member", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("banner").getByRole("link", { name: "Logg inn" }).click();
  await page.getByRole("button", { name: "Logg inn med Feide" }).click();

  await page.getByPlaceholder("Search or choose from the list").click();
  await page.getByLabel("Feide test users").click();

  await page.getByLabel("Username").fill("marit789faculty");
  await page.getByLabel("Password", { exact: true }).fill("098asd");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Grunn: NOT_MEMBER_OF_ECHO")).toBeVisible();
});
