import { expect } from "@playwright/test";

import { test } from "../helpers/sessionTest";

test("Student")("register to event", async ({ page }) => {
  await page.goto("/arrangement/party-med-webkom");

  await expect(page.getByText("Party med Webkom", { exact: true })).toBeVisible();
  await expect(page.getByText("Velkommen til party med Webkom!", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "One-click påmelding" }).click();

  await expect(page.getByTestId("toast")).toContainText("Du er nå påmeldt arrangementet");
});
