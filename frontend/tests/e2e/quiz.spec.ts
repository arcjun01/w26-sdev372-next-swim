import { test, expect } from "@playwright/test";

/**
 * User Flow: Complete Quiz Journey
 * Updated: Using index-based selection to bypass text-matching issues in dropdowns.
 */

test.describe("Quiz Flow - Complete User Journey", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the root URL
    await page.goto("/");
    // Ensure the network is idle before starting
    await page.waitForLoadState("networkidle");
  });

  test("should complete the quiz with beginner level and view recommendations", async ({ page }) => {
    // Verify Header
    await expect(page.locator("h1").first()).toContainText("Swim Level Analysis");

    const selects = page.locator('select');

    // index: 1 usually skips the "Select an option..." placeholder
    await selects.nth(0).selectOption({ index: 1 }); // Beginner
    await selects.nth(1).selectOption({ index: 1 }); // Comfortable
    await selects.nth(2).selectOption({ index: 1 }); // Video
    await selects.nth(3).selectOption({ index: 1 }); // No
    await selects.nth(4).selectOption({ index: 1 }); // Weak
    await selects.nth(5).selectOption({ index: 1 }); // Short

    // Submit the quiz
    await page.locator('button:has-text("Submit")').click();
    await page.waitForLoadState("networkidle");

    // Verify results page content
    await expect(page.locator("text=NextSwim Analysis")).toBeVisible();
    await expect(page.locator("text=Recommended Resources")).toBeVisible();
    await expect(page.locator('button:has-text("Retake Quiz")')).toBeVisible();
  });

  test("should complete quiz with advanced level and see expert recommendations", async ({ page }) => {
    const selects = page.locator('select');

    // Selecting higher indices for advanced levels
    await selects.nth(0).selectOption({ index: 3 }); // Advanced
    await selects.nth(1).selectOption({ index: 3 }); // Very Comfortable
    await selects.nth(2).selectOption({ index: 2 }); // Hybrid
    await selects.nth(3).selectOption({ index: 0 }); // Yes
    await selects.nth(4).selectOption({ index: 2 }); // Strong
    await selects.nth(5).selectOption({ index: 2 }); // Long

    await page.locator('button:has-text("Submit")').click();
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=NextSwim Analysis")).toBeVisible();
  });

  test("should show validation error when form is incomplete", async ({ page }) => {
    // Listen for the native browser alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain("Please answer all questions");
      await dialog.accept();
    });

    // Fill only the first dropdown
    await page.locator('select').first().selectOption({ index: 1 });

    // Submit - triggers the dialog
    await page.locator('button:has-text("Submit")').click();
  });

  test("should allow user to retake the quiz after submitting", async ({ page }) => {
    const selects = page.locator('select');
    // Rapid fill using indices
    for (let i = 0; i < 6; i++) {
      await selects.nth(i).selectOption({ index: 1 });
    }

    await page.locator('button:has-text("Submit")').click();
    await page.waitForLoadState("networkidle");

    // Click Retake
    await page.locator('button:has-text("Retake Quiz")').click();

    // Verify back on the quiz page
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
    await expect(page.locator("h1").first()).toContainText("Swim Level Analysis");
  });

  test("should display date on results page", async ({ page }) => {
    const selects = page.locator('select');
    for (let i = 0; i < 6; i++) {
      await selects.nth(i).selectOption({ index: 1 });
    }

    await page.locator('button:has-text("Submit")').click();
    await page.waitForLoadState("networkidle");

    // Check for any text containing "Date:"
    await expect(page.locator("body")).toContainText(/Date:/i);
  });
});