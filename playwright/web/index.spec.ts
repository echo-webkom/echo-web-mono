import { expect, test } from "@playwright/test";

test("web frontpage", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("echo – Linjeforeningen for informatikk");
});
