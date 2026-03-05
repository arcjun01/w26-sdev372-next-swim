# E2E Testing Guide for NextSwim

## Overview

This document describes how to run Playwright end-to-end tests for the NextSwim application. The tests cover complete user workflows including the Quiz flow and Resource management flow.

## Test Scenarios

### 1. Quiz Flow Tests (`tests/e2e/quiz.spec.ts`)
Complete end-to-end tests for the swimming assessment quiz:

- **Complete beginner quiz**: User selects beginner level questions and receives recommendations
- **Advanced quiz with expert recommendations**: User with advanced skills receives expert-level resources
- **Form validation**: Tests that missing fields trigger validation errors
- **Quiz retry functionality**: User can retake the quiz after submitting
- **Results page date display**: Verification that date is properly displayed
- **No resources scenario**: Graceful handling when no resources match preferences

**Coverage**: 6 comprehensive test cases

### 2. Resources Management Tests (`tests/e2e/resources.spec.ts`)
Complete end-to-end tests for resource management workflow:

- **Add new resource**: Create a new aquatic resource and verify it appears in the list
- **Form field validation**: All required fields are present and validated
- **Missing field handling**: Validation errors for incomplete forms
- **Form clearing**: Form data is cleared after successful submission
- **Resource grouping**: Resources are properly grouped by difficulty level
- **Resource collapsing**: Expandable/collapsible resource groups work correctly
- **Resource details display**: All resource information is displayed correctly
- **External links**: Resource links open in new tabs with proper security attributes
- **Multiple resource types**: Different resource types (Video, Article, Document) are handled correctly

**Coverage**: 9 comprehensive test cases

## Prerequisites

### Local Development

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install

# Install Docker and Docker Compose (if running against containers)
# macOS: brew install docker
# Windows: Install Docker Desktop
# Linux: Follow Docker installation guide
```

### System Requirements

- Node.js v20.12.0 or higher
- npm 10.5.0 or higher
- Docker and Docker Compose (for containerized testing)
- 4GB RAM minimum

## Running Tests

### Option 1: Against Local Development Server

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3 - Run E2E Tests:**
```bash
cd frontend
npm run test:e2e
```

### Option 2: Against Dockerized Application (Recommended)

**Start the application stack:**
```bash
# Using the e2e-specific docker-compose file
docker-compose -f docker-compose.e2e.yml up -d --build

# Wait for services to be healthy (approximately 30-60 seconds)
# Monitor logs:
docker-compose -f docker-compose.e2e.yml logs -f

# Run tests once containers are ready
cd frontend
npm run test:e2e -- --baseURL=http://localhost:5173
```

**Stop the application:**
```bash
docker-compose -f docker-compose.e2e.yml down
```

### Option 3: Using Docker Network (Advanced)

If running Playwright tests inside a Docker container on the same network:

```bash
docker-compose -f docker-compose.e2e.yml up -d --build

# Run tests targeting the internal Docker network
cd frontend
npm run test:e2e -- --baseURL=http://frontend:80
```

## Available Test Commands

```bash
# Run all e2e tests
npm run test:e2e

# Run tests with UI (interactive mode) - great for debugging
npm run test:e2e:ui

# Run tests in debug mode with breakpoints
npm run test:e2e:debug

# Run specific test file
npm run test:e2e -- tests/e2e/quiz.spec.ts

# Run tests in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox

# Run with verbose output
npm run test:e2e -- --verbose

# Run single test by name
npm run test:e2e -- -g "should successfully add a new resource"
```

## Configuring Base URL

Tests will run against `http://localhost:5173` by default. To override:

```bash
# Using environment variable
BASE_URL=http://localhost:8080 npm run test:e2e

# Using command-line argument
npm run test:e2e -- --baseURL=http://localhost:8080
```

## Test Execution Flow

### Quiz Flow Test Sequence
1. Navigate to application
2. Fill out all 6 quiz questions
3. Submit quiz form
4. Verify recommendations page loads
5. Check personalized results based on answers
6. Verify retake functionality

### Resources Flow Test Sequence
1. Navigate to application
2. Locate Add Resource form
3. Fill all required fields (title, type, level, description, URL)
4. Submit form
5. Verify success confirmation
6. Verify new resource appears in the list
7. Confirm all resource details are displayed

## Test Isolation

All tests are designed to be:
- **Independent**: Each test can run in any order
- **Isolated**: Tests use unique IDs (timestamps) to avoid conflicts
- **Data-driven**: Tests don't depend on pre-existing database state
- **Repeatable**: Tests can run multiple times with consistent results

## Expected Test Results

When all tests pass, you should see output similar to:

```
  Quiz Flow - Complete User Journey
    ✓ should complete the quiz with beginner level and view recommendations (2.5s)
    ✓ should complete quiz with advanced level and see expert recommendations (1.8s)
    ✓ should show validation error when form is incomplete (0.9s)
    ✓ should allow user to retake the quiz after submitting (2.1s)
    ✓ should display date on results page (1.9s)
    ✓ should show message when no resources match user preferences (1.7s)

  Resources Flow - Add and Manage Resources
    ✓ should successfully add a new resource and verify it appears in the list (3.2s)
    ✓ should display all required fields in the add resource form (0.8s)
    ✓ should show validation error when required field is missing (0.7s)
    ✓ should clear form after successful submission (2.4s)
    ✓ should display resources grouped by difficulty level (1.1s)
    ✓ should expand and collapse resource level groups (1.2s)
    ✓ should display all resource details correctly (0.9s)
    ✓ should open resource links in new tab (0.6s)
    ✓ should handle resource types correctly (4.5s)

15 passed (35s)
```

## Debugging Tests

### Using Playwright Inspector

```bash
npm run test:e2e:debug
```

This opens the Playwright Inspector where you can:
- Step through tests line by line
- Inspect DOM elements
- See network activity
- View console messages

### Using UI Mode

```bash
npm run test:e2e:ui
```

Interactive mode showing live test execution with:
- Test timeline
- Step-by-step execution
- DOM inspection
- Screenshot comparisons

### Common Issues

#### **Tests timeout waiting for page to load**
```bash
# Increase timeout
npm run test:e2e -- --timeout=60000
```

#### **Port already in use**
```bash
# Find and kill process
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

#### **Database not ready**
```bash
# Wait for database health before running tests
docker-compose -f docker-compose.e2e.yml up -d --wait
sleep 10
npm run test:e2e
```

#### **Tests can't connect to backend**
- Verify backend is running on port 3001
- Check Docker network (if using containers)
- Verify firewall settings

## Continuous Integration

For CI/CD pipelines (GitHub Actions, GitLab CI, etc.):

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: |
    npm ci
    npm run test:e2e
  env:
    CI: true
    BASE_URL: http://localhost:5173
```

## Test Coverage

Current test coverage:
- **Total E2E Tests**: 15
- **User Flows**: 2
- **Test Categories**: Quiz, Resources, Form Validation, Data Management
- **Browsers Tested**: Chromium, Firefox
- **Estimated Runtime**: 30-40 seconds

## Troubleshooting

### Playwright Installation Issues

If Playwright browsers aren't installed:
```bash
npx playwright install
npx playwright install-deps
```

### Database Reset Between Tests

The application reloads data from the database for each test. If you need to reset:

```bash
docker-compose -f docker-compose.e2e.yml down -v  # Remove volumes
docker-compose -f docker-compose.e2e.yml up -d --build
```

## Performance Considerations

- Tests typically run in 30-40 seconds total
- Each test takes 0.6-4.5 seconds depending on complexity
- Tests use parallel execution by default (CSS-like selectors are optimized)
- Network delays accounted for with `waitForLoadState("networkidle")`

## Contributing New Tests

To add new e2e tests:

1. Create new test file in `frontend/tests/e2e/`
2. Follow existing patterns with descriptive test names
3. Use `beforeEach` to navigate and set up state
4. Use meaningful assertions with clear error messages
5. Add documentation describing the user flow

Example:
```typescript
test("should complete a user workflow", async ({ page }) => {
  await page.goto("/");
  // Your test steps
  await expect(page.locator("text=Success")).toBeVisible();
});
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-page)
