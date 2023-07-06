import { test, expect } from "@playwright/test";

export async function alertMessage(page, expectedMessage) {
  const errorLocator = await page.locator(
    "span.label.label-text-alt.text-error"
  );
  await errorLocator.isVisible();
  expect(errorLocator).toHaveText(expectedMessage);
}

export async function toastMessage(page, expectedMessage) {
  await page.waitForTimeout(1000);
  await page.waitForSelector("div.ct-toast.ct-toast-error"), { timeout: 6000 };
  const locator = page.locator("div.ct-text");
  await expect(locator).toContainText(expectedMessage);
}
