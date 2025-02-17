import { expect, test } from "@playwright/test";

import { loginAs } from "../../helpers/sessionTest";

test.describe("Gruppe", () => {
  test("see group dashboard", async ({ page }) => {
    await loginAs(page, "Admin");

    //TODO: check dynamic user id
    await page.goto("/auth/user/admin");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).toContainText("Webkom");

    await webkomChip.click();

    await expect(page.getByText("Administrer Webkom")).toBeVisible();
  });

  test("not see group dashboard", async ({ page }) => {
    await loginAs(page, "Student");

    //TODO: check dynamic user id
    await page.goto("/auth/user/student");

    const webkomChip = page.getByRole("link", { name: "Webkom" });

    await expect(webkomChip).not.toBeVisible();

    await page.goto("/gruppe/webkom");

    await expect(page.getByText("Ikke medlem av gruppen")).toBeVisible();
  });
});
