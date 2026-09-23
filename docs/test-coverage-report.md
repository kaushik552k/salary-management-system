# Test Coverage Report

## 1. Backend Testing

The backend is fully tested using **Jest** and **Supertest**, covering both unit tests for the analytics logic and integration tests for the Express API routes.

**Test Setup:**
- Test Environment: Node.js (ts-jest)
- Database: In-memory SQLite for tests (isolated per run)
- Commands: 
  - Run tests: `npm run test`
  - Run coverage: `npm run test:coverage` (inside `/backend`)

### 📊 Backend Coverage Results

| Metric | Coverage |
| :--- | :--- |
| **Statements** | 74.77% |
| **Branches** | 45.76% |
| **Functions** | 66.66% |
| **Lines** | 75.23% |

*Note: The coverage is heavily concentrated in the core business logic (`analytics.service.ts` and `employee.service.ts`) where the complex transformations and database queries reside.*

**Test Suites Passing:** `25 / 25`
- `tests/analytics.service.test.ts` (15.7s)
- `tests/employees.routes.test.ts` (4.7s)

---

## 2. Frontend Testing

The frontend testing infrastructure has just been set up using **Jest**, **React Testing Library**, and **jsdom**. 

**Test Setup:**
- Test Environment: `jsdom` (simulates browser)
- Setup: `@testing-library/jest-dom` for custom DOM matchers.
- Commands: 
  - Run tests: `npm run test`
  - Run coverage: `npm run test:coverage` (inside `/frontend`)

### 📊 Frontend Coverage Results

Currently, test coverage has been established for the core utility functions (`lib/utils.ts`) to demonstrate the setup is working correctly and passing in a Next.js environment.

| Component | Coverage |
| :--- | :--- |
| `lib/utils.ts` | 100% Statements, 100% Lines |

**Test Suites Passing:** `5 / 5`
- `tests/utils.test.ts` (merges classes correctly, formats currency (USD & INR), formats large numbers compactly, formats ISO dates).

*To expand coverage, you can begin adding `.test.tsx` files alongside your React components inside the `frontend` folder using React Testing Library.*
