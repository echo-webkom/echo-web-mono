import { test as baseTest, expect } from "@playwright/test";
import postgres from "postgres";

import { test } from "../helpers/sessionTest";

const SLUG = "test-i-prod-med-webkom";
const ID = "5cbb5337-a6e6-4eff-a821-a73722594f47";

const sql = postgres(process.env.DATABASE_URL!);

baseTest.describe("Register", () => {
  baseTest.beforeEach(async () => {
    await sql`DELETE FROM registration WHERE happening_id = ${ID}`;
  });

  test("Student")("register and deregister to event", async ({ page }) => {
    await page.goto(`/arrangement/${SLUG}`);

    await expect(page.getByText("Test i prod med Webkom", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Velkommen til testing i prod med Webkom!", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "One-click påmelding" }).click();

    await expect(page.getByTestId("toast")).toContainText("Du er nå påmeldt arrangementet");

    await page.getByRole("button", { name: "Meld av" }).click();

    await page.getByRole("textbox").fill("Jeg vil ikke lenger delta på arrangementet");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByTestId("toast")).toContainText("Du er nå avmeldt");
  });

  baseTest("only one should be able to register", async ({ browser }) => {
    const ctx1 = await browser.newContext();
    const ctx2 = await browser.newContext();

    await ctx1.addCookies([
      {
        name: "next-auth.session-token",
        value: "student",
        domain: "localhost",
        path: "/",
        expires: -1,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    await ctx2.addCookies([
      {
        name: "next-auth.session-token",
        value: "student2",
        domain: "localhost",
        path: "/",
        expires: -1,
        secure: false,
        sameSite: "Lax",
      },
    ]);

    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    await Promise.all([page1, page2].map((page) => page.goto(`/arrangement/${SLUG}`)));

    await Promise.all(
      [page1, page2].map((page) =>
        expect(page.getByText("Test i prod med Webkom", { exact: true })).toBeVisible(),
      ),
    );

    await Promise.all(
      [page1, page2].map((page) =>
        page.getByRole("button", { name: "One-click påmelding" }).click(),
      ),
    );

    const resp1 = await page1.getByTestId("toast").textContent();
    const resp2 = await page2.getByTestId("toast").textContent();

    if (resp1 === resp2) {
      throw new Error("Both users got the same response");
    }

    if (resp1?.includes("Du er nå påmeldt arrangementet")) {
      expect(resp2).toContain("Du er nå på venteliste");
    }

    if (resp2?.includes("Du er nå påmeldt arrangementet")) {
      expect(resp1).toContain("Du er nå på venteliste");
    }

    await ctx1.close();
    await ctx2.close();
  });

  test("Student5")("should not be able to register to event", async ({ page }) => {
    await page.goto(`/arrangement/${SLUG}`);

    await expect(page.getByText("Test i prod med Webkom", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Velkommen til testing i prod med Webkom!", { exact: true }),
    ).toBeVisible();

    await page.getByRole("button", { name: "One-click påmelding" }).click();

    await expect(page.getByTestId("toast")).toContainText(
      "Du kan ikke melde deg på dette arrangementet",
    );
  });

  test("Admin")("see admin dashboard link", async ({ page }) => {
    await page.goto(`/arrangement/${SLUG}`);

    await expect(page.getByText("Test i prod med Webkom", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Velkommen til testing i prod med Webkom!", { exact: true }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Admin dashbord" })).toBeVisible();
  });
});
