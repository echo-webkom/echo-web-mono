import { expect, test } from "@playwright/test";
import postgres from "postgres";

import { loginAs } from "../helpers/sessionTest";

const user = { id: "alum", name: "Andreas Aanes" };

const sql = postgres(process.env.DATABASE_URL!);

test.describe("Strikes", () => {
  test.beforeEach(async () => {
    await sql`DELETE FROM strike`;
    await sql`DELETE FROM strike_info`;
    await fetch("http://localhost:3000/api/revalidate", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.ADMIN_KEY!}` },
      body: JSON.stringify({ tag: `strikes-user-${user.id}` }),
    });
  });

  test("should be able to add and remove strike", async ({ page }) => {
    await loginAs(page, "Admin");

    await page.goto(`/prikker/${user.id}`);

    await expect(page.getByText(`${user.name}`, { exact: true })).toBeVisible();
    await expect(page.getByText("Gyldige prikker: 0", { exact: true })).toBeVisible();
    await expect(page.getByText("Totalt antall prikker: 0", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Gi prikker" }).click();

    await page.getByLabel("Velg bedpres").selectOption("Tidligere bedpres!");
    await page.getByLabel("Type prikk").selectOption("Du ga feil informasjon.");

    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByTestId("toast")).toContainText("Prikker lagt til");

    await expect(page.getByText("Gyldige prikker: 1", { exact: true })).toBeVisible();
    await expect(page.getByText("Totalt antall prikker: 1", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Slett prikk" }).click();
    await page.getByRole("button", { name: "Bekreft sletting" }).click();

    await expect(page.getByTestId("toast")).toContainText("Prikken ble slettet");
  });

  test("should not be able to access /prikker", async ({ page }) => {
    await loginAs(page, "Student");

    await page.goto("/prikker");
    await expect(page).toHaveTitle("echo – Linjeforeningen for informatikk");

    await page.goto(`/prikker/${user.id}`);
    await expect(page).toHaveTitle("echo – Linjeforeningen for informatikk");
  });
});
