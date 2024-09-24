import { expect, test } from "@playwright/test";

test.describe("Health", () => {
  test("should be able to check health", async ({ page }) => {
    await page.goto("/helse");
    const healthText = page.getByTestId("health-text");
    await expect(healthText).toContainText("API is: OK");
  });
});
