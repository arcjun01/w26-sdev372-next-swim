# Quick Start: Running E2E Tests

## 🚀 Fastest Way to Run Tests

### Windows
```bash
# Run tests and automatically manage Docker
.\run-e2e-tests.bat run

# Or manually control services
.\run-e2e-tests.bat start
cd frontend
npm run test:e2e
.\run-e2e-tests.bat stop
```

### macOS/Linux
```bash
# Run tests and automatically manage Docker
bash run-e2e-tests.sh run

# Or manually control services
bash run-e2e-tests.sh start
cd frontend
npm run test:e2e
bash run-e2e-tests.sh stop
```

## 📋 What the Tests Cover

### Test Suite 1: Quiz Flow (6 tests)
- ✅ Complete beginner quiz and view recommendations
- ✅ Complete advanced quiz and view expert recommendations
- ✅ Form validation for missing fields
- ✅ Retake quiz after submission
- ✅ Date display on results page
- ✅ Handle cases with no matching resources

### Test Suite 2: Resources Flow (9 tests)
- ✅ Add new resource and verify in list
- ✅ Validate all form fields are present
- ✅ Show error when required fields missing
- ✅ Clear form after successful submission
- ✅ Display resources grouped by difficulty level
- ✅ Expand/collapse resource level groups
- ✅ Display all resource details correctly
- ✅ Open external links in new tab
- ✅ Handle different resource types (Video, Article, Document)

**Total: 15 comprehensive E2E tests**

## 🔍 Manual Test Execution

If you prefer to run tests manually without the helper scripts:

### 1. Start the Full Application Stack
```bash
docker-compose -f docker-compose.e2e.yml up -d --build
# Wait about 30-60 seconds for all services to be ready
```

### 2. Run Tests in a New Terminal
```bash
cd frontend
npm run test:e2e
```

### 3. View Test Results
Tests will output results directly to console, with detailed HTML report generated in `frontend/playwright-report/`

### 4. When Done, Stop Services
```bash
docker-compose -f docker-compose.e2e.yml down -v
```

## 🎯 Running Against Local Dev Servers

If you want to run tests against local development servers instead of Docker:

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```

### Terminal 3: Tests
```bash
cd frontend
npm run test:e2e -- --baseURL=http://localhost:5173
```

## 🎬 Advanced Test Commands

```bash
# Run specific test file
npm run test:e2e -- tests/e2e/quiz.spec.ts

# Run specific test by name
npm run test:e2e -- -g "should successfully add a new resource"

# Run in UI mode (interactive, great for debugging)
npm run test:e2e:ui

# Run with debugging enabled
npm run test:e2e:debug

# Run in specific browser only
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox

# Generate report
npm run test:e2e
# Open report
npx playwright show-report
```

## 📊 Expected Results

All 15 tests should pass in approximately 30-40 seconds:

```
  ✓ Quiz Flow - Complete User Journey (6 tests)
  ✓ Resources Flow - Add and Manage Resources (9 tests)

15 passed (35s)

HTML Report: frontend/playwright-report/index.html
```

## 🐛 Troubleshooting

### Tests timeout or can't connect
```bash
# Make sure ports are available
# Windows
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# macOS/Linux
lsof -i :5173
lsof -i :3001

# If ports in use, kill the process or change docker-compose port mappings
```

### Docker containers not starting
```bash
# Check logs
docker-compose -f docker-compose.e2e.yml logs

# Rebuild containers
docker-compose -f docker-compose.e2e.yml down -v
docker-compose -f docker-compose.e2e.yml up -d --build
```

### Playwright browsers not installed
```bash
cd frontend
npx playwright install
npx playwright install-deps
```

## 📖 Full Documentation

See [E2E_TESTING.md](./E2E_TESTING.md) for comprehensive documentation including:
- Detailed setup instructions
- Configuration options
- CI/CD integration
- Debugging techniques
- Test contribution guidelines

## ✨ Test Highlights

- **Isolated tests**: Each test uses unique identifiers to avoid conflicts
- **No pre-existing data required**: Tests work with empty database
- **Cross-browser**: Tests run on Chromium and Firefox
- **Docker-ready**: Complete setup for containerized testing
- **Data validation**: Tests verify request/response data integrity
- **User workflows**: Real end-to-end user journey coverage
