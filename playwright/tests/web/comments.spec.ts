import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { loginAs } from "../../helpers/sessionTest";

const SLUG = "test-i-prod-med-webkom";
const ID = "5cbb5337-a6e6-4eff-a821-a73722594f47";

const sql = postgres(process.env.DATABASE_URL!);

test.describe("Comments", () => {
  test.beforeEach(async () => {
    await sql`DELETE FROM comments_reactions WHERE comment_id IN (SELECT id FROM comment WHERE post_id = ${ID})`;
    await sql`DELETE FROM comment WHERE post_id = ${ID}`;
  });

  test("create a comment on a happening", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto(`/arrangement/${SLUG}`);

    await expect(page.getByRole("heading", { name: "Kommentarer" })).toBeVisible();
    await expect(
      page.getByText("Ingen kommentarer enda. Bli den første til å kommentere!"),
    ).toBeVisible();

    await page.getByPlaceholder("Skriv din kommentar her...").fill("Dette er en testkommentar");
    await page.getByRole("button", { name: "Legg til kommentar" }).click();

    await expect(page.getByTestId("toast")).toContainText("Kommentar lagt til");
    await expect(page.getByText("Dette er en testkommentar")).toBeVisible();
  });

  test("reply to a comment", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto(`/arrangement/${SLUG}`);

    // Create the initial comment
    await page.getByPlaceholder("Skriv din kommentar her...").fill("Første kommentar");
    await page.getByRole("button", { name: "Legg til kommentar" }).click();
    await expect(page.getByTestId("toast")).toContainText("Kommentar lagt til");
    await expect(page.getByText("Første kommentar")).toBeVisible();

    // Reply to the comment
    await page.getByRole("button", { name: "Svar" }).first().click();
    await page.getByPlaceholder("Svar på kommentaren...").fill("Dette er et svar");
    await page
      .locator("form")
      .filter({ hasText: "Svar" })
      .getByRole("button", { name: "Svar" })
      .click();

    await page.waitForTimeout(1000);
    await expect(page.getByText("Dette er et svar")).toBeVisible();
  });

  test("like a comment", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto(`/arrangement/${SLUG}`);

    // Create a comment first
    await page.getByPlaceholder("Skriv din kommentar her...").fill("Lik denne kommentaren");
    await page.getByRole("button", { name: "Legg til kommentar" }).click();
    await expect(page.getByTestId("toast")).toContainText("Kommentar lagt til");
    await expect(page.getByText("Lik denne kommentaren")).toBeVisible();

    // The like button shows "0" initially
    const commentItem = page.locator("li").filter({ hasText: "Lik denne kommentaren" });
    const likeButton = commentItem.locator("button").filter({ hasText: "0" });
    await likeButton.click();

    // After liking, the count should be 1
    await expect(commentItem.locator("button").filter({ hasText: "1" })).toBeVisible();
  });
});
