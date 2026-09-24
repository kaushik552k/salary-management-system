# Trade-offs & Design Decisions

## 1. SQLite over PostgreSQL

**Chose**: SQLite via Prisma  
**Alternative**: PostgreSQL (Supabase / local)

**Reasoning**: The assessment explicitly suggested SQLite. At 10,000 rows with server-side pagination, SQLite is more than adequate — queries return in < 10ms. The Prisma abstraction means swapping to PostgreSQL in production requires only a one-line datasource change.

**Trade-off**: SQLite doesn't support `mode: insensitive` full-text search (PostgreSQL-only Prisma feature). Implemented case-sensitive `LIKE` search instead — acceptable because SQLite's `LIKE` is natively case-insensitive for ASCII characters.

---

## 2. Multi-Currency Handling

**Chose**: True multi-currency with on-the-fly normalization to USD  
**Alternative**: Single base currency (storing all salaries in USD) OR Full Historical Ledger

**Reasoning**:
- **Data Model Complexity vs Reality**: Employees are paid in local currencies in reality (e.g., INR in India, EUR in Germany). A "Single Base Currency" approach (converting to USD at creation time and storing only USD) loses the source of truth and would make editing the salary difficult for local HR reps. Storing local currency + amount preserves the true business data without needing a complex multi-ledger model.
- **Exchange Rate Sourcing/Staleness**: We normalize to USD in the analytics layer using fixed, hard-coded exchange rates (`employee.schema.ts`). We deliberately chose this over a Live FX API to avoid runtime dependencies, API key management, and failure modes that could break the dashboard.
- **Analytics Accuracy vs Historical Fluctuations**: Our analytics are "point-in-time approximate". We deliberately chose *not* to handle historical exchange rate fluctuations. Tracking exact historical USD value for every pay run would require a complex time-series ledger. For the purpose of high-level HR reporting and trend analysis, a static normalization rate is sufficient.

**Trade-off**: Analytics USD figures will drift from exact real-time financial reality, and historical trend charts use today's exchange rates rather than the historical rates for past dates. This is explicitly documented and accepted for this version's scope.

---

## 3. Soft Delete over Hard Delete

**Chose**: `status = "Inactive"` (soft delete)  
**Alternative**: Physical `DELETE` from database

**Reasoning**: In HR systems, employee data must be preserved for audit, historical reporting, and payroll history. Physically deleting an employee would corrupt any future analytics on "who we paid in 2024".

**Trade-off**: Requires filtering `status = 'Active'` in most queries. Analytics only count active employees by default. The list page filters Active by default but allows showing Inactive records via the status filter.

---

## 4. Server-Side Pagination over Client-Side

**Chose**: Backend handles `skip`/`take` with Prisma, frontend gets one page at a time  
**Alternative**: Fetch all 10,000 employees and filter/paginate in the browser

**Reasoning**: Loading 10,000 rows into memory would cause:
- Slow initial load (~2-4MB JSON transfer)
- Memory pressure in the browser
- No scalability beyond 10k employees

Server-side pagination keeps each response < 50 rows and < 20KB.

**Trade-off**: Each filter/sort change requires a network round-trip. Mitigated by TanStack Query's `placeholderData` which shows the previous page's data while the new page loads, preventing layout shift.

---

## 5. Single Employee Table over Separate `Salaries` Table

**Chose**: `Employee` model contains salary fields directly  
**Alternative**: `Employee` + `Salary` tables (1:many, for salary history)

**Reasoning**: The requirements say "manage salary data" — there's no mention of salary revision history. A separate Salaries table would add join complexity without satisfying a stated requirement.

**Trade-off**: No salary history/audit trail. If the HR team needs to track "what did this person earn in 2023 vs 2024?", a separate Salaries table would be necessary. Documented in requirements as deliberately out of scope.

---

## 6. App Router (Next.js 14) over Pages Router

**Chose**: Next.js 14 App Router  
**Alternative**: Pages Router (legacy Next.js)

**Reasoning**: App Router is the current standard. All new Next.js features (Server Components, streaming, improved layouts) are App Router-only. The HR dashboard is a good fit — mostly client-fetched data with a shared layout.

**Trade-off**: `useSearchParams()` in client components requires a `Suspense` boundary, adding a small amount of boilerplate. This is the correct pattern and was implemented correctly.

---

## 7. Component Library: shadcn/ui over MUI or Ant Design

**Chose**: shadcn/ui primitives + Tailwind  
**Alternative**: MUI, Ant Design, Chakra UI

**Reasoning**: 
- Components are *copied into the project*, not imported — full control, no library constraints
- Pairs naturally with Tailwind CSS (which Next.js ships with)
- Results in a significantly more modern, premium look vs. default MUI/Ant themes
- No version conflicts or breaking library upgrades

**Trade-off**: No pre-built data table from shadcn — used TanStack Table v8 separately, which is actually more capable (server-side pagination, virtualization-ready).
