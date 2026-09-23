# Requirements Document
## ACME Corp Salary Management System

**Author:** Kaushik Dutta  
**Date:** September 2026  
**Version:** 1.0

---

## 1. Goal

Replace ACME Corp's Excel-based salary management process with a web application that allows the HR Manager to manage salary data for 10,000 employees across multiple countries and answer analytical questions about how the organisation pays its people.

---

## 2. User Persona

**Primary User:** HR Manager at ACME Corp  
- Manages salary data daily for all 10,000 employees  
- Needs to search, filter, and update salary records quickly  
- Wants dashboards to answer questions like "How do we pay compared across departments?" or "What's our total payroll in the US?"  
- Is not a developer — the UI must be intuitive without training

---

## 3. Scope & Features

### In Scope

| Feature | Description |
|---|---|
| **Employee Directory** | Paginated, searchable, sortable table of all employees |
| **Filtering** | Filter by department, country, job level, employment type, status |
| **Salary CRUD** | Create, view, edit, and deactivate employee salary records |
| **Multi-Currency** | Each employee carries their local currency; analytics normalise to USD |
| **Analytics Dashboard** | KPI cards + charts: salary by dept, by country, by level, pay distribution histogram, employment type breakdown |
| **CSV Export** | Download the currently filtered employee set as a CSV |
| **Data Seeding** | Seed script generating 10,000 realistic employees across 10 countries |
| **Unit & Integration Tests** | Full backend test suite covering services and API routes |

### Deliberately Out of Scope

| Feature | Reason |
|---|---|
| **Authentication / Login** | The system is scoped to a single HR Manager persona — adding auth adds significant complexity without adding value to this assessment. Would be the next feature in production. |
| **Role-Based Access Control** | Single user, single role — RBAC is premature. |
| **Payroll Processing / Payslips** | A separate product domain requiring legal, tax, and accounting integrations. |
| **Tax Calculations** | Country-specific legal complexity; requires live country-law data. Out of scope. |
| **Benefits / PTO Management** | A different HR product area, not salary management. |
| **Real-Time Salary History / Audit Log** | Nice-to-have; adds DB complexity. Excluded for this version. |
| **Live FX Rates** | Fixed exchange rates are sufficient for analytics; live rates require a paid API and add a runtime dependency. Rates are clearly documented as approximate. |
| **Email Notifications** | No notification requirements stated. |
| **Mobile App** | The HR Manager works at a desktop — a responsive web app is sufficient. |

---

## 4. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | Employee list page loads with 10k records using server-side pagination (≤ 50ms per query) |
| **Correctness** | All salary operations validated with Zod schemas before hitting the database |
| **Test Coverage** | All core business logic covered by unit tests; all API routes covered by integration tests |
| **Code Quality** | TypeScript strict mode; service layer separated from HTTP layer |
| **Maintainability** | Clear folder structure, named exports, inline comments on non-obvious decisions |

---

## 5. Key Design Decisions

1. **Soft Deletes**: Employees are marked `Inactive` rather than physically deleted. This preserves historical data integrity.
2. **Multi-Currency**: Salaries are stored in local currency. Analytics normalize to USD using fixed exchange rates (documented in code). This is realistic and shows product thinking.
3. **Server-Side Pagination**: All filtering and pagination happens on the backend. The UI never loads all 10,000 records into memory.
4. **SQLite**: Chosen because it's self-contained, portable, and sufficient for a single-node app of this scale. Would swap to PostgreSQL for production.
