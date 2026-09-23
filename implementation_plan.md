# Incubyte Assessment — Salary Management System

## Background & Problem

ACME org's HR team manages salary data for **10,000 employees across multiple countries** via Excel sheets. The goal is to replace this with a production-quality web application that lets the HR Manager:
- View, search, filter, and manage employee salary data
- Answer analytical questions about how the org pays people (pay equity, distribution, trends)

---

## Open Questions for User

> [!IMPORTANT]
> Please confirm or override any of the decisions below before we start building.

1. **Currency**: ⏳ *Awaiting clarification from Incubyte HR — mail drafted below.*

> [!NOTE]
> **Resolved**: Deployment will be handled later if required. Git repo will be initialized at `c:\Users\Kaushik Dutta\Desktop\incubyte-assignment` with incremental commits.

---

## Proposed Tech Stack

### Backend
| Layer | Choice | Rationale |
|---|---|---|
| Language | **TypeScript** | Role requirement; type safety critical for financial data |
| Framework | **Express.js** | Battle-tested, widely understood, easy to test |
| ORM | **Prisma** | Type-safe DB layer, great DX, auto-generates client |
| Database | **SQLite** (via `better-sqlite3`) | Assessment requirement; zero infra, file-based |
| Testing | **Jest + Supertest** | Standard Node.js test stack, fast, deterministic |
| Validation | **Zod** | Runtime schema validation on all API inputs |

### Frontend
| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 14 + TypeScript** | App Router, SSR for fast initial load, API routes if needed, role requirement |
| UI Library | **shadcn/ui + Radix UI** | Modern, headless, fully accessible, beautiful out-of-the-box |
| Data Tables | **TanStack Table v8** | Best-in-class for 10k row datasets; virtualized, sortable, filterable |
| Data Fetching | **TanStack Query (React Query)** | Client-side caching, pagination, background refetch |
| Charts | **Recharts** | Composable, React-first, good for dashboards |
| Forms | **React Hook Form + Zod** | Type-safe forms with validation |
| Styling | **Tailwind CSS** (via shadcn/ui) | shadcn requires Tailwind; utility-first, rapid UI dev |

### Project Structure
```
incubyte-assignment/
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/           # API route handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/        # Error handling, validation
│   │   ├── prisma/           # Schema + migrations
│   │   └── scripts/          # Seed script (10k employees)
│   ├── tests/                # Jest unit + integration tests
│   └── package.json
├── frontend/                 # Next.js 14 App Router
│   ├── app/
│   │   ├── (dashboard)/      # Dashboard page
│   │   ├── employees/        # Employee list + detail pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client (typed), utilities
│   └── package.json
├── docs/                     # Artifacts (requirements, architecture, etc.)
│   ├── requirements.md       # One-page requirements doc (assessment requirement)
│   ├── architecture.md       # Architecture diagram + decisions
│   └── ai-prompts.md         # AI tool usage log
└── README.md
```

---

## Proposed Features (Scope)

### ✅ In Scope
| Feature | Description |
|---|---|
| **Employee Directory** | Paginated table with search, multi-column sort |
| **Salary CRUD** | Create, view, edit, delete salary records |
| **Filters** | By department, country, job level, employment type |
| **Analytics Dashboard** | Pay distribution histogram, salary by dept/country, headcount stats |
| **Bulk Seed** | Script to seed 10,000 realistic employees across countries/depts |
| **Export** | CSV download of filtered results |
| **Unit Tests** | Service-layer and API route tests (backend) |

### ❌ Deliberately Out of Scope (with reasoning)
| Feature | Reason |
|---|---|
| Authentication/Login | Adds significant complexity; not asked for; HR tool can be internal |
| Role-based access control | Overkill for single persona (HR Manager) |
| Payroll processing / payslips | Different problem domain; not in requirements |
| Real-time updates / WebSockets | Not needed; salary changes are not frequent |
| Benefits / PTO management | Separate product concern |
| Tax calculations | Country-specific legal complexity; out of scope |
| Audit trail / versioning | Nice-to-have but not core to the problem |

---

## Data Model

```
Employee
├── id (UUID)
├── employeeId (string, unique, e.g., "EMP-00042")
├── firstName, lastName
├── email
├── department (enum: Engineering, HR, Sales, Finance, Marketing, Operations, Legal, Product)
├── jobTitle
├── jobLevel (enum: L1–L6 / Junior, Mid, Senior, Lead, Principal, Director)
├── employmentType (enum: Full-time, Part-time, Contract)
├── country (ISO code)
├── currency (ISO code, e.g., USD, INR, GBP)
├── baseSalary (Decimal)
├── bonus (Decimal, nullable)
├── joiningDate (Date)
├── status (enum: Active, Inactive)
└── createdAt, updatedAt

```

---

## API Design (RESTful)

```
GET    /api/employees          # List with pagination, search, filters
GET    /api/employees/:id      # Single employee detail
POST   /api/employees          # Create new employee + salary
PUT    /api/employees/:id      # Update employee + salary
DELETE /api/employees/:id      # Soft-delete (status = Inactive)

GET    /api/analytics/summary          # Headcount, avg salary, total payroll
GET    /api/analytics/by-department    # Salary breakdown by dept
GET    /api/analytics/by-country       # Salary breakdown by country
GET    /api/analytics/distribution     # Salary histogram buckets
GET    /api/analytics/by-level         # Salary by job level

GET    /api/employees/export    # CSV download
```

---

## UI Pages

| Page | Description |
|---|---|
| **Dashboard** | KPI cards + charts (headcount, avg salary, pay distribution, by dept/country) |
| **Employees** | Full data table — search, filter, sort, paginate, export |
| **Employee Detail** | Individual profile + salary info |
| **Add/Edit Employee** | Form with validation |

---

## Testing Strategy

### Backend (Jest + Supertest)
- Service-layer unit tests for all business logic (salary calculations, filter logic)
- Integration tests for all API endpoints
- Edge cases: invalid inputs (Zod), not found, duplicate IDs

### Frontend (Vitest + React Testing Library)
- Component tests for key UI components
- Hook tests for data fetching hooks

---

## Verification Plan

### Automated
```bash
cd backend && npm test      # Jest suite
cd frontend && npm test     # Vitest suite
```

### Manual
- Seed 10,000 employees and verify table loads under 500ms
- Test all CRUD flows through UI
- Verify analytics charts render correctly
- Record video demo

---

## Incremental Commit Strategy

| Phase | Commits |
|---|---|
| 1. Init + structure | monorepo setup, tsconfig, prisma init |
| 2. Data model | prisma schema, migrations |
| 3. Seed script | 10k employee seed |
| 4. Backend API | routes + services + validation |
| 5. Backend tests | full test suite |
| 6. Frontend scaffold | Vite + shadcn/ui setup |
| 7. Employee table | list, search, filter, sort, paginate |
| 8. CRUD | add/edit/delete employee |
| 9. Analytics | dashboard + charts |
| 10. Export + polish | CSV export, UI polish |
| 11. Docs + artifacts | requirements doc, architecture, AI prompts log |
