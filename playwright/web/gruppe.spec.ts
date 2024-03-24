import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/sessionTest";

test.describe("Gruppe", () => {
  test("see group dashboard", async ({ page }) => {
    await loginAs(page, "Admin");

    await page.goto("/auth/profil");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).toContainText("Webkom");

    await webkomChip.click();

    await expect(page.getByText("Administrer Webkom")).toBeVisible();
  });

  test("not see group dashboard", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto("/auth/profil");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).not.toBeVisible();

    await page.goto("/gruppe/webkom");

    await expect(page.getByText("Ikke medlem av gruppen")).toBeVisible();
  });
});
