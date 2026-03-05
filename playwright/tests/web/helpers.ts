import { expect, type Page } from "@playwright/test";

const TOASTER_SELECTOR = "[data-sonner-toast]";

/**
 * Check if a toaster is visible with specific text.
 * When multiple toasters are visible, it checks the first one.
 *
 * @param page playwright page object
 * @param text text to check for in the toaster
 */
export const iExpectToasterToHaveText = async (page: Page, text: string) => {
  const toast = page.locator(TOASTER_SELECTOR).first();
  await expect(toast).toContainText(text);
};

/**
 * Get the text content of the first visible toaster.
 * Useful for cases where the text might change dynamically and you want to assert on it later.
 *
 * @param page playwright page object
 * @returns the text content of the first visible toaster
 */
export const getToasterText = async (page: Page) => {
  const toast = page.locator(TOASTER_SELECTOR).first();
  await toast.waitFor({ state: "visible" });
  return await toast.textContent();
};
