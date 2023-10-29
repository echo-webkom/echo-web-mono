import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/tilbakemelding");

  await page.getByPlaceholder("Velg en kategori").click();
  await page.getByText("Bug").click();

  await page.getByPlaceholder("Din tilbakemelding").click();
  await page.getByPlaceholder("Din tilbakemelding").fill("Hello world!");

  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByTestId("toast")).toContainText("Takk for tilbakemeldingen!");
});
