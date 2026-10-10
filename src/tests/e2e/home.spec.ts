import { expect, test } from "@playwright/test";

test("homepage has one visible heading and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});
