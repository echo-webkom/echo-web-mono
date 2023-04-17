import {expect, test} from "@playwright/test";

test("/api/sanity redirect to /", async ({page}) => {
  await page.goto("/api/sanity");

  await expect(page).toHaveTitle("echo – Linjeforeningen for informatikk");
});
