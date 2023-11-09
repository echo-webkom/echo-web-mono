import { expect, test } from "@playwright/test";

test("update profile", async ({ context }) => {
  await context.addCookies([
    {
      name: "next-auth.session-token",
      value: "admin",
      domain: "localhost",
      path: "/",
      expires: -1,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  const page = await context.newPage();

  await page.goto("/auth/profil");

  await expect(page.getByText("Admin", { exact: true })).toBeVisible();
  await expect(page.getByText("admin@echo.uib.no", { exact: true })).toBeVisible();

  await page.getByLabel("Studieretning").selectOption("Datateknologi");
  await page.getByLabel("Årstrinn").selectOption("3. trinn");

  await page.getByRole("button", { name: "Lagre" }).click();

  await expect(page.getByTestId("toast").getByText("Brukeren ble oppdatert")).toBeVisible();
});
