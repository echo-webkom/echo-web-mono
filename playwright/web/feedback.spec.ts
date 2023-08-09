import {expect, test} from "@playwright/test";

test("test", async ({page}) => {
  await page.goto("/");

  await page.getByTestId("feedback-button").click();
  await page.getByPlaceholder("Din tilbakemelding").click();
  await page.getByPlaceholder("Din tilbakemelding").fill("Hello world!");

  await page.getByRole("button", {name: "Send"}).click();

  await expect(page.getByTestId("toast")).toContainText("Tilbakemelding sendt");
});
