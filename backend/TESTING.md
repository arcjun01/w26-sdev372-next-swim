# Backend Unit Tests

## Overview

This test suite provides comprehensive coverage of the backend API, including critical business logic and all database interactions. Tests use Jest as the test framework and Supertest for HTTP assertions, with complete database mocking to ensure tests run independently.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Coverage

### Test Suites

#### 1. **App Tests** (`tests/app.test.js`)
Tests the main Express application and middleware setup.

- **Health Check Route**
  - ✅ Returns correct status response from `GET /api/swim`
  
- **Invalid Routes**
  - ✅ Returns 404 for undefined routes

#### 2. **Aquatic Resources Routes** (`tests/routes/aquaticResources.test.js`)
Comprehensive tests for the aquatic resources API endpoints with complete database mocking.

##### GET /api/aquatic-resources
- ✅ Returns all aquatic resources
- ✅ Returns empty array when no resources exist
- ✅ Returns 500 error when database query fails
- ✅ Handles various error types gracefully (connection refused, timeout, access denied)

##### POST /api/aquatic-resources
- ✅ Creates a new aquatic resource successfully
- ✅ Returns correct insert ID from database
- ✅ Handles missing required fields
- ✅ Returns 500 error when database insert fails
- ✅ Handles various database errors (foreign key constraints, column mismatch, locked database)
- ✅ Preserves exact structure of request data in response
- ✅ Accepts JSON requests with correct content-type
- ✅ Handles empty request body

##### Request Validation & Edge Cases
- ✅ Processes requests with extra fields gracefully (ignores unused fields)
- ✅ Handles concurrent POST requests properly

## Test Structure

```
backend/
├── tests/
│   ├── app.test.js                    # Main app tests
│   └── routes/
│       └── aquaticResources.test.js  # Route-specific tests
├── jest.config.js                     # Jest configuration
├── src/                               # Application source code
│   ├── config/
│   │   └── db.js                     # Mocked in tests
│   └── routes/
│       └── aquaticResources.js
├── app.js                             # Main Express app
└── package.json                       # Test dependencies added
```

## Database Mocking

All tests use Jest's `jest.mock()` to mock the database pool. This means:
- **No actual database connection required** - tests run in isolation
- **Predictable test behavior** - mocked responses return expected values
- **Fast test execution** - no I/O latency
- **Easy to test edge cases** - simulated errors without real database issues

### Mock Example
```javascript
jest.mock("../../src/config/db");
const pool = require("../../src/config/db");

// Mock a successful query
pool.query.mockResolvedValueOnce([mockResources]);

// Mock a failed query
pool.query.mockRejectedValueOnce(new Error("Connection failed"));
```

## Test Coverage Statistics

- **Total Tests**: 16
- **All Tests**: ✅ Passing
- **Execution Time**: ~2.8 seconds
- **Coverage includes**:
  - Happy path scenarios (successful operations)
  - Error handling (database failures, connection issues)
  - Edge cases (empty data, extra fields, concurrent requests)
  - Input validation (missing fields, various data types)

## Test Assertions

Each test verifies:
1. **HTTP Status Codes** - Correct response status (200, 201, 500)
2. **Response Body** - Correct data structure and values
3. **Database Calls** - Correct SQL queries and parameters
4. **Error Messages** - Appropriate error responses
5. **Data Integrity** - Request data preserved in responses

## Example Test Pattern

```javascript
it("should create a new aquatic resource successfully", async () => {
  // Arrange: Mock the database response
  pool.query.mockResolvedValueOnce([{ insertId: 10 }]);

  // Act: Make the HTTP request
  const res = await request(app)
    .post("/api/aquatic-resources")
    .send(validPayload);

  // Assert: Verify response and database call
  expect(res.status).toBe(201);
  expect(res.body.id).toBe(10);
  expect(pool.query).toHaveBeenCalledWith(
    "INSERT INTO aquatic_resources (...)",
    [expectedValues]
  );
});
```

## Dependencies

- **jest**: Modern JavaScript testing framework
- **supertest**: HTTP assertion library for Express apps
- **nodemon**: Development server with auto-reload (dev dependency)

## Notes

- Tests are configured with `--detectOpenHandles --forceExit` to ensure clean shutdown
- Dotenv loads environment variables during test execution
- Mock database mimics the exact structure of actual MySQL2 responses
- Tests are isolated and can run in any order

## Extending Tests

To add new tests:
1. Create test file in `tests/routes/` or `tests/`
2. Follow the existing pattern with proper mocking
3. Use descriptive test names
4. Run `npm test` to verify

Example:
```javascript
describe("New Feature", () => {
  it("should do something specific", async () => {
    // Test implementation
  });
});
```
