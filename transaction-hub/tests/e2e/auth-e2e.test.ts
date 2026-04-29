import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  const basePath = {
    login: "/login",
    register: "/register",
    account: "/account",
  };

  test("complete login and logout flow", async ({ page }) => {
    await page.goto(basePath.login);

    await page.locator('input[type="email"]').fill("playwright@playwright.com");
    await page.locator('input[type="password"]').fill("playwright");

    await page.click('button[type="submit"]');

    await page.waitForURL(basePath.account);
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
    await expect(page.getByText(/role:/i)).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();

    await page.waitForURL(basePath.login);
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("unauthenticated user redirected to login", async ({ page }) => {
    await page.goto(basePath.account);

    await page.waitForURL(basePath.login);

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("registration flow", async ({ page }) => {
    const randomEmail = `test${Date.now()}@example.com`;

    await page.goto(basePath.register);

    await page
      .locator('input[name="name"], input[type="text"]')
      .fill("Test User");
    await page.locator('input[type="email"]').fill(randomEmail);
    await page.locator('input[type="password"]').first().fill("password123");
    await page.locator('input[type="password"]').last().fill("password123");

    await page.click('button[type="submit"]');

    await page.waitForURL(basePath.account);

    await expect(page.getByText("Welcome")).toBeVisible();
  });
});
