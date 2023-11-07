import { expect, test } from "@playwright/test";

test("sending feedback", async ({ page }) => {
  await page.goto("/tilbakemelding");

  await page.getByLabel("Kategori*").selectOption("bug");

  await page.getByPlaceholder("Din tilbakemelding").click();
  await page.getByPlaceholder("Din tilbakemelding").fill("Hello world!");

  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByTestId("toast")).toContainText("Takk for tilbakemeldingen!");
});
