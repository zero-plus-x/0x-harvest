import { test, expect } from "@playwright/test";

test("should redirect to the login page and back after logging in", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL("/login");
  await expect(page.locator(".ant-avatar")).not.toBeVisible();

  await page.locator("#e2e-test-login").click();
  await page.locator(".ant-avatar").waitFor();
  await expect(page.locator("text=Fill empty days with work")).toBeVisible();
  await expect(page).toHaveURL("/");
});
