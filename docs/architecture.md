# Architecture

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│              Next.js 14 (App Router)                    │
│         React + TanStack Query + shadcn/ui              │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (REST)
                         │ localhost:3001
┌────────────────────────▼────────────────────────────────┐
│                   Express REST API                      │
│           Node.js + TypeScript + Zod validation         │
│                                                         │
│   Routes → Services → Prisma ORM                        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                     SQLite                              │
│                    (dev.db)                             │
└─────────────────────────────────────────────────────────┘
```

## Backend Layer Breakdown

```
src/
├── index.ts              # Server bootstrap (PORT binding)
├── app.ts                # Express app factory (testable)
├── lib/
│   └── prisma.ts         # Singleton Prisma client
├── middleware/
│   └── error.middleware.ts  # Centralised error handling
├── schemas/
│   └── employee.schema.ts   # Zod schemas + domain constants
├── routes/
│   ├── employees.ts      # HTTP handlers (thin controllers)
│   └── analytics.ts
└── services/
    ├── employee.service.ts  # Business logic
    └── analytics.service.ts
```

**Key architectural decisions:**

1. **`app.ts` vs `index.ts` split** — The Express app is created in a factory function (`createApp()`) separate from the server binding. This makes the app fully testable with Supertest without starting a real server.

2. **Service layer** — All business logic (duplicate email checks, soft deletes, currency assignment, pagination) lives in services, not routes. Routes are thin controllers that parse input and delegate.

3. **Prisma singleton** — One `PrismaClient` instance is created and reused. Multiple instances in a Node.js process exhaust SQLite's connection pool.

4. **Indexes** — The `Employee` table has indexes on `department`, `country`, `status`, `jobLevel`, and `employmentType` — the five most-filtered columns. This keeps filtered queries fast even at 10k rows.

## Frontend Layer Breakdown

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout (sidebar, providers)
│   ├── page.tsx             # Dashboard (redirect to /dashboard)
│   ├── dashboard/page.tsx   # Analytics dashboard
│   └── employees/
│       ├── page.tsx         # Employee list
│       ├── new/page.tsx     # Add employee form
│       └── [id]/
│           ├── page.tsx     # Employee detail view
│           └── edit/page.tsx
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── employees/           # Domain-specific components
│   └── analytics/           # Chart components
├── hooks/
│   ├── use-employees.ts     # TanStack Query hooks
│   └── use-analytics.ts
└── lib/
    ├── api.ts               # Typed API client
    └── utils.ts
```

**Key frontend decisions:**

1. **Server-side pagination** — The table never loads all 10k employees. URL state (page, limit, filters, sort) is the source of truth, enabling shareable filtered URLs.

2. **TanStack Table** — Used for the employee table for its first-class support of server-side pagination, sorting, and filtering. It separates table logic from rendering.

3. **TanStack Query** — Handles API caching, loading states, and background refetching. Filter changes invalidate only the relevant query.

4. **shadcn/ui** — Provides accessible, styled components without opinionated design constraints. Components are copied into the project, not imported from a library, giving full control.

## Trade-offs & Rationale

| Decision | Alternative | Why this choice |
|---|---|---|
| SQLite | PostgreSQL | Zero infra; file-based; sufficient at 10k rows; trivially swap with Prisma |
| Express | Fastify | More familiar; better ecosystem; adequate for this scale |
| Fixed FX rates | Live FX API | No runtime API dependency; rates documented as approximate; adequate for analytics |
| Soft delete | Hard delete | Preserves data integrity; common in HR systems where employee history matters |
| Server-side pagination | Client-side | 10k rows in memory is wasteful; server-side scales indefinitely |
