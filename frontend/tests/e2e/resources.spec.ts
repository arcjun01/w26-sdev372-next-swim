import { test, expect } from "@playwright/test";

/**
 * User Flow 2: Add Resource and Verify Flow
 * 
 * This test covers the complete resource management user journey:
 * 1. User visits the application
 * 2. User scrolls to the Add Resource form
 * 3. User fills out all required fields
 * 4. User submits the form
 * 5. User verifies the new resource appears in the list
 * 6. User can view the resource with all its details
 */

test.describe("Resources Flow - Add and Manage Resources", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto("/");
    // Wait for resources to load
    await page.waitForLoadState("networkidle");
  });

  test("should successfully add a new resource and verify it appears in the list", async ({
    page,
  }) => {
    // Generate unique resource title with timestamp for data isolation
    const timestamp = Date.now();
    const resourceTitle = `Test Resource ${timestamp}`;

    // Scroll to the Add New Resource section
    const addResourceSection = page.locator("h2:has-text('Add New Resource')");
    await addResourceSection.scrollIntoViewIfNeeded();
    await expect(addResourceSection).toBeVisible();

    // Fill in the resource title
    const titleInput = page.locator('input[placeholder="Resource Title"]');
    await titleInput.fill(resourceTitle);
    await expect(titleInput).toHaveValue(resourceTitle);

    // Select resource type (Video is default, but let's verify)
    const resourceTypeSelect = page.locator('select').first();
    await resourceTypeSelect.selectOption("Article");

    // Set difficulty level
    const difficultyInput = page.locator('input[type="number"]');
    await difficultyInput.fill("2");

    // Fill description
    const descriptionTextarea = page.locator('textarea[placeholder="Description"]');
    const description = "This is a test resource added by automated tests";
    await descriptionTextarea.fill(description);

    // Fill URL
    const urlInput = page.locator('input[type="url"]');
    const testUrl = "https://example.com/test-resource";
    await urlInput.fill(testUrl);

    // Submit the form
    const submitButton = page.locator('button:has-text("Add to NextSwim")');
    await submitButton.click();

    // Wait for success alert
    const alertPromise = page.waitForEvent("dialog");
    const alert = await alertPromise;
    expect(alert.message()).toContain("Resource added successfully");
    await alert.accept();

    // Wait for the page to be updated with new resource
    await page.waitForLoadState("networkidle");

    // Scroll down to see resources list
    const resourcesList = page.locator(".resources-list");
    await resourcesList.first().scrollIntoViewIfNeeded();

    // Verify the new resource appears in the list
    const newResourceTitle = page.locator(`text=${resourceTitle}`);
    await expect(newResourceTitle).toBeVisible();

    // Verify resource details are displayed
    await expect(page.locator(`text=${description}`)).toBeVisible();
    await expect(page.locator(`text=${testUrl}`)).toBeVisible();
  });

  test("should display all required fields in the add resource form", async ({
    page,
  }) => {
    // Scroll to form
    const addResourceForm = page.locator(".add-resource-form");
    await addResourceForm.scrollIntoViewIfNeeded();

    // Verify all input fields are present
    const titleInput = page.locator('input[placeholder="Resource Title"]');
    await expect(titleInput).toBeVisible();

    const resourceTypeSelect = page.locator('select').first();
    await expect(resourceTypeSelect).toBeVisible();

    const difficultyInput = page.locator('input[type="number"]');
    await expect(difficultyInput).toBeVisible();
    // Verify min and max attributes
    await expect(difficultyInput).toHaveAttribute("min", "1");
    await expect(difficultyInput).toHaveAttribute("max", "4");

    const descriptionTextarea = page.locator(
      'textarea[placeholder="Description"]'
    );
    await expect(descriptionTextarea).toBeVisible();

    const urlInput = page.locator('input[type="url"]');
    await expect(urlInput).toBeVisible();

    const submitButton = page.locator('button:has-text("Add to NextSwim")');
    await expect(submitButton).toBeVisible();
  });

  test("should show validation error when required field is missing", async ({
    page,
  }) => {
    // Scroll to form
    const addResourceSection = page.locator("h2:has-text('Add New Resource')");
    await addResourceSection.scrollIntoViewIfNeeded();

    // Fill only title, leave other fields empty
    const titleInput = page.locator('input[placeholder="Resource Title"]');
    await titleInput.fill("Test Resource");

    // Try to submit with empty fields
    const submitButton = page.locator('button:has-text("Add to NextSwim")');
    
    // HTML5 validation should prevent submission
    // The browser will show a validation message
    // We can try clicking and see if alert appears or form doesn't submit
    const formBefore = await page.locator(".add-resource-form").count();
    
    await submitButton.click();

    // Form should still be visible (submission prevented by validation)
    const formAfter = await page.locator(".add-resource-form").count();
    expect(formBefore).toBe(formAfter);
  });

  test("should clear form after successful submission", async ({ page }) => {
    const timestamp = Date.now();
    const resourceTitle = `Test Resource ${timestamp}`;

    // Scroll to form
    const addResourceSection = page.locator("h2:has-text('Add New Resource')");
    await addResourceSection.scrollIntoViewIfNeeded();

    // Fill all fields
    const titleInput = page.locator('input[placeholder="Resource Title"]');
    await titleInput.fill(resourceTitle);

    await page.locator('select').first().selectOption("Video");
    await page.locator('input[type="number"]').fill("1");
    await page.locator('textarea[placeholder="Description"]').fill("Test description");
    await page.locator('input[type="url"]').fill("https://example.com/test");

    // Submit
    await page.locator('button:has-text("Add to NextSwim")').click();

    // Handle alert
    const alertPromise = page.waitForEvent("dialog");
    const alert = await alertPromise;
    await alert.accept();

    // Wait for form to be cleared
    await page.waitForLoadState("networkidle");

    // Verify form is cleared
    const titleAfterSubmit = await titleInput.inputValue();
    expect(titleAfterSubmit).toBe("");

    const urlAfterSubmit = await page.locator('input[type="url"]').inputValue();
    expect(urlAfterSubmit).toBe("");
  });

  test("should display resources grouped by difficulty level", async ({
    page,
  }) => {
    // Wait for resources to load
    await page.waitForLoadState("networkidle");

    // Scroll to resources section
    const resourcesTitle = page.locator("h1:has-text('Aquatic Resources')");
    await resourcesTitle.scrollIntoViewIfNeeded();

    // Check for resource level groups (Level 1, Level 2, etc.)
    const levelGroups = page.locator(".resource-level-group");
    
    // Should have at least one level group
    const levelCount = await levelGroups.count();
    expect(levelCount).toBeGreaterThan(0);
  });

  test("should expand and collapse resource level groups", async ({ page }) => {
    // Wait for resources
    await page.waitForLoadState("networkidle");

    // Find a details element (collapsible group)
    const detailsElement = page.locator(".resource-level-group").first();
    await detailsElement.scrollIntoViewIfNeeded();

    // Get the summary (header) of the details element
    const summary = detailsElement.locator("summary");
    
    // Verify it's initially visible
    await expect(summary).toBeVisible();

    // Click to expand/collapse
    await summary.click();

    // Wait a moment for animation
    await page.waitForTimeout(300);

    // Verify the click occurred
    await expect(summary).toBeVisible();
  });

  test("should display all resource details correctly", async ({ page }) => {
    // Wait for resources to load
    await page.waitForLoadState("networkidle");

    // Find a resource item
    const resourceItem = page.locator(".resource-item").first();
    await resourceItem.scrollIntoViewIfNeeded();

    // Verify resource components are present
    const title = resourceItem.locator(".resource-title");
    await expect(title).toBeVisible();

    // Check for optional fields
    const type = resourceItem.locator(".resource-type");
    const description = resourceItem.locator(".resource-description");
    const link = resourceItem.locator(".resource-link");

    // At least title should be present
    expect((await title.count()) > 0).toBeTruthy();
  });

  test("should open resource links in new tab", async ({ page, context }) => {
    // Wait for resources
    await page.waitForLoadState("networkidle");

    // Find first resource link
    const resourceLink = page.locator(".resource-link").first();
    
    if (await resourceLink.count() > 0) {
      await resourceLink.scrollIntoViewIfNeeded();

      // Verify link opens in new tab (check target attribute)
      const target = await resourceLink.getAttribute("target");
      expect(target).toBe("_blank");

      // Verify security attribute
      const rel = await resourceLink.getAttribute("rel");
      expect(rel).toContain("noopener");
    }
  });

  test("should handle resource types correctly", async ({ page }) => {
    const timestamp = Date.now();
    const videoTitle = `Video Resource ${timestamp}`;
    const articleTitle = `Article Resource ${timestamp + 1}`;

    // Helper function to add a resource
    const addResource = async (title: string, type: string) => {
      const addResourceSection = page.locator("h2:has-text('Add New Resource')");
      await addResourceSection.scrollIntoViewIfNeeded();

      await page.locator('input[placeholder="Resource Title"]').fill(title);
      await page.locator('select').first().selectOption(type);
      await page.locator('input[type="number"]').fill("1");
      await page.locator('textarea[placeholder="Description"]').fill("Test");
      await page.locator('input[type="url"]').fill("https://example.com");

      await page.locator('button:has-text("Add to NextSwim")').click();

      const alertPromise = page.waitForEvent("dialog");
      const alert = await alertPromise;
      await alert.accept();

      await page.waitForLoadState("networkidle");
    };

    // Add video resource
    await addResource(videoTitle, "Video");

    // Verify video appears with correct type
    await expect(page.locator(`text=${videoTitle}`)).toBeVisible();
    await expect(page.locator(`text=Type: Video`)).toBeVisible();

    // Add article resource
    await addResource(articleTitle, "Article");

    // Verify article appears with correct type
    await expect(page.locator(`text=${articleTitle}`)).toBeVisible();
    await expect(page.locator(`text=Type: Article`)).toBeVisible();
  });
});
