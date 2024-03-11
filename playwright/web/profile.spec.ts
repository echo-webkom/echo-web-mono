import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/sessionTest";

test("update profile", async ({ page }) => {
  await loginAs(page, "Student");

  await page.goto("/auth/profil");

  await expect(page.getByText("Student", { exact: true })).toBeVisible();
  await expect(page.getByText("student@echo.uib.no", { exact: true })).toBeVisible();

  await page.getByLabel("Studieretning").selectOption("Datateknologi");
  await page.getByLabel("Årstrinn").selectOption("3. trinn");

  await page.getByRole("button", { name: "Lagre" }).nth(1).click();

  await expect(page.getByTestId("toast").getByText("Brukeren ble oppdatert")).toBeVisible();
});

test("see admin dashboard", async ({ page }) => {
  await loginAs(page, "Admin");

  await page.goto("/");

  await page.getByTestId("user-menu").click();

  const dashboardItem = page.getByRole("menuitem", { name: "Dashboard" });

  await expect(dashboardItem).toBeVisible();

  await dashboardItem.click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
