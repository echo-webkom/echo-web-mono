import { test as baseTest, expect } from "@playwright/test";

import { test } from "../helpers/sessionTest";

baseTest.describe("Gruppe", () => {
  test("Admin")("see group dashboard", async ({ page }) => {
    await page.goto("/auth/profil");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).toContainText("Webkom");

    await webkomChip.click();

    await expect(page.getByText("Administrer Webkom")).toBeVisible();
  });

  test("Student")("not see group dashboard", async ({ page }) => {
    await page.goto("/auth/profil");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).not.toBeVisible();

    await page.goto("/gruppe/webkom");

    await expect(page.getByText("Ikke medlem av gruppen")).toBeVisible();
  });
});
