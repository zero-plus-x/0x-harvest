import { test, expect } from "@playwright/test";

test("should redirect to the login page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});
