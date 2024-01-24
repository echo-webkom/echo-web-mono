import { expect } from "@playwright/test";

import { test } from "../helpers/sessionTest";

test("Student")("update profile", async ({ page }) => {
  await page.goto("/auth/profil");

  await expect(page.getByText("Student", { exact: true })).toBeVisible();
  await expect(page.getByText("student@echo.uib.no", { exact: true })).toBeVisible();

  await page.getByLabel("Studieretning").selectOption("Datateknologi");
  await page.getByLabel("Årstrinn").selectOption("3. trinn");

  await page.getByRole("button", { name: "Lagre" }).nth(1).click();

  await expect(page.getByTestId("toast").getByText("Brukeren ble oppdatert")).toBeVisible();
});

test("Admin")("see admin dashboard", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("user-menu").click();

  const dashboardItem = page.getByRole("menuitem", { name: "Dashboard" });

  await expect(dashboardItem).toBeVisible();

  await dashboardItem.click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
