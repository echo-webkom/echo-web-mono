import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { loginAs } from "../../helpers/sessionTest";

const SLUG = "test-i-prod-med-webkom";
const ID = "5cbb5337-a6e6-4eff-a821-a73722594f47";

const sql = postgres(process.env.DATABASE_URL!);

test.describe("Reactions", () => {
  test.beforeEach(async () => {
    await sql`DELETE FROM reaction WHERE react_to_key = ${ID}`;
  });

  test("add a reaction to an event", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto(`/arrangement/${SLUG}`);

    // Find and click the party emoji reaction button (🥳)
    const reactionButton = page.getByRole("button", { name: /🥳/ });
    await expect(reactionButton).toBeVisible();

    // Get the initial count
    const initialText = await reactionButton.textContent();
    const initialCount = parseInt(initialText?.replace("🥳", "").trim() ?? "0");

    await reactionButton.click();

    // Count should increase by 1
    await expect(reactionButton).toContainText(`${initialCount + 1}`);
  });
});
