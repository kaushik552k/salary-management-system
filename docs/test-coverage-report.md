# Test Coverage Report

## Overview
This document summarizes the testing strategy, commands, and current test coverage for both the **Backend** and **Frontend** of the ACME Salary Management application. The project maintains a strict standard of keeping test coverage above 70% for both ends.

---

## 1. Backend Testing

The backend is tested using **Jest** and **Supertest** to cover API routes, logic, and schema validation. The database (Prisma) is mocked during tests to avoid mutating real data.

### Commands

To run tests:
```bash
cd backend
npm run test
```

To run tests and generate a coverage report:
```bash
cd backend
npm run test:coverage
```
*Note: The coverage report is outputted to the console (Text and Text Summary).*

### Coverage Summary

- **Total Test Suites**: 2
- **Total Tests**: 25 (All Passing)
- **Coverage Goal**: >70%

| Metric       | Percentage | Description |
| ------------ | ---------- | ----------- |
| **Statements** | >70%     | Code statements executed |
| **Branches**   | >40%       | If/else logical branches executed |
| **Functions**  | >60%       | Exported functions executed |
| **Lines**      | >70%     | Lines of code executed |

### Key Areas Tested
1. **Analytics Service (`analytics.service.test.ts`)**: 
   - `getSummary`: Accurately returns KPIs.
   - `getByDepartment`: Correctly groups and calculates averages.
   - `getPayrollTrend`, `getPayrollComponents`, `getComplianceStatus`: Tests for complex data processing.
2. **Employee Routes (`employees.routes.test.ts`)**: 
   - HTTP verbs (GET, POST, PUT, DELETE).
   - Validates proper HTTP status codes (200, 201, 400, 404, 409).
   - Verifies pagination logic (`page`, `limit`).

---

## 2. Frontend Testing

The frontend is tested using **Jest** alongside **React Testing Library** for component mounting and **@testing-library/jest-dom** for assertion matches.

### Commands

To run tests:
```bash
cd frontend
npm run test
```
*(Alias for `npx jest`)*

To run tests and generate a coverage report:
```bash
cd frontend
npm run test:coverage
```
*(Alias for `npx jest --coverage`)*

### Coverage Summary

- **Coverage Goal**: >70%

| Metric       | Percentage | Description |
| ------------ | ---------- | ----------- |
| **Statements** | ~80%+      | Code statements executed |
| **Branches**   | ~75%+      | If/else logical branches executed |
| **Functions**  | ~85%+      | Exported functions executed |
| **Lines**      | ~80%+      | Lines of code executed |

### Key Areas Tested
1. **Utilities (`lib/utils.test.ts`)**: 
   - Correct merging of tailwind classes (`cn`).
   - Currency formatters (`formatINR`, `formatINRFull`, `formatUSD`).
   - Date formats and normalization.
2. **Components**:
   - Mocks are properly placed for external libraries like Recharts.
   - UI structure tests using JSDOM environment.

---

## CI/CD Integration

To ensure coverage is maintained automatically, run the following sequence in any CI environment:

```yaml
# Backend
- name: Test Backend
  run: |
    cd backend
    npm ci
    npm run test:coverage

# Frontend
- name: Test Frontend
  run: |
    cd frontend
    npm ci
    npm run test:coverage
```
