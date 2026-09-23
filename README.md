# Salary Management System — ACME Corp

A production-quality web application for managing salary data across 10,000 employees in a multinational organization.

Built as part of the Incubyte Software Craftsperson assessment.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + TypeScript + Express.js |
| ORM | Prisma |
| Database | SQLite |
| Frontend | Next.js 14 (App Router) + TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Data Tables | TanStack Table v8 |
| Charts | Recharts |
| Testing | Jest + Supertest (backend), Vitest + RTL (frontend) |

## Project Structure

```
incubyte-assignment/
├── backend/        # Express REST API
├── frontend/       # Next.js 14 App
└── docs/           # Requirements, architecture, AI usage artifacts
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed         # Seeds 10,000 employees
npm run dev          # Starts API on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # Starts UI on http://localhost:3000
```

### Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Documentation

- [`docs/requirements.md`](./docs/requirements.md) — Scope, features, and deliberate exclusions
- [`docs/architecture.md`](./docs/architecture.md) — Architecture decisions and diagrams
- [`docs/ai-prompts.md`](./docs/ai-prompts.md) — AI tool usage log
- [`docs/tradeoffs.md`](./docs/tradeoffs.md) — Design tradeoffs and reasoning

## Features

- 📋 **Employee Directory** — Search, filter, sort, paginate 10k employees
- 💰 **Salary Management** — Full CRUD with multi-currency support
- 📊 **Analytics Dashboard** — Pay distribution, salary by dept/country/level
- 📥 **CSV Export** — Download filtered results
- ✅ **Comprehensive Tests** — Unit + integration test suite
