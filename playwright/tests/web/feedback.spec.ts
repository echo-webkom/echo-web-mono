import { test } from "@playwright/test";

import { iExpectToasterToHaveText } from "./helpers";

test("sending feedback", async ({ page }) => {
  await page.goto("/tilbakemelding");

  await page.getByLabel("Kategori*").selectOption("bug");

  await page.getByPlaceholder("Din tilbakemelding").click();
  await page.getByPlaceholder("Din tilbakemelding").fill("Hello world!");

  await page.getByRole("button", { name: "Send" }).click();

  await iExpectToasterToHaveText(page, "Takk for tilbakemeldingen!");
});
