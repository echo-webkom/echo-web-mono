import { test as baseTest, expect } from "@playwright/test";
import postgres from "postgres";

import { test } from "../helpers/sessionTest";

const SLUG = "party-med-webkom";
const ID = "5cbb5337-a6e6-4eff-a821-a73722594f47";

const sql = postgres(process.env.DATABASE_URL!);

baseTest.describe("Register", () => {
  baseTest.beforeEach(async () => {
    await sql`DELETE FROM registration WHERE happening_id = ${ID}`;
  });

  test("Student")("register to event", async ({ page }) => {
    await page.goto(`/arrangement/${SLUG}`);

    await expect(page.getByText("Party med Webkom", { exact: true })).toBeVisible();
    await expect(page.getByText("Velkommen til party med Webkom!", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "One-click påmelding" }).click();

    await expect(page.getByTestId("toast")).toContainText("Du er nå påmeldt arrangementet");
  });
});
