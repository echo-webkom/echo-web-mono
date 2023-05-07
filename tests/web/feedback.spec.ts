import {expect, test} from "@playwright/test";

test("test", async ({page}) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button").nth(2).click();
  await page.getByPlaceholder("Din tilbakemelding").click();
  await page.getByPlaceholder("Din tilbakemelding").fill("Hello world!");
  await page.getByRole("button", {name: "Send"}).click();
  await expect(page.getByTestId("toast")).toContainText("Tilbakemelding sendt");
});
