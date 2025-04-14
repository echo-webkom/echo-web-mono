import { expect, test } from "@playwright/test";

test("api health from web", async ({ page }) => {
  await page.goto("/helse");

  const text = page.getByTestId("health-text");

  await expect(text).toHaveText("API is: OK");
});
