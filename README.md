# OpsHub

**One workspace for smarter operations.**

OpsHub is an enterprise Operations Management Platform for managing employees, tasks, resources, approvals, teams, and analytics from one centralized system. Built as a demonstration of production-grade full-stack engineering practices: a modular Nx monorepo, Angular with signals, a hardened NestJS API, PostgreSQL, Keycloak-based authentication, and automated end-to-end testing with Playwright.

This project is under active, phased development. The sections below reflect what is actually implemented today; the roadmap at the bottom shows what's coming next.

## Features (implemented so far)

- Enterprise application shell: collapsible sidebar, top navigation, search, light/dark theme with system-preference detection and persistence
- Operational dashboard with KPI cards and live charts (task completion, team performance, resource usage), built on mock data pending real API wiring
- A hardened NestJS API: Helmet security headers, CORS allowlist, global request validation, Swagger/OpenAPI documentation, and a real health endpoint
- Dockerized PostgreSQL for local development

## Architecture

Angular (apps/web) talks to the NestJS API (apps/api), which talks to PostgreSQL.

The workspace is an Nx monorepo using project-reference-based TypeScript, with enforced module boundaries so frontend and backend code can never cross-import, and feature libraries can never import each other directly.

## Project structure

apps/web is the Angular application shell and routing. apps/api is the NestJS application bootstrap. apps/web-e2e is the Playwright test suite.

libs/shared/models holds types shared between web and api. libs/shared/util holds framework-agnostic helpers. libs/web/ui is the design system (Button, Badge, Avatar, Input, StatCard, ChartCard, and more). libs/web/shell holds the Sidebar and TopNav. Each libs/web/feature-* is a lazy-loaded feature library, one per route. libs/api/common holds cross-cutting API concerns. libs/api/auth and libs/api/prisma are reserved for authentication and database access, landing in later phases.

## Local setup

Requirements: Node 22 or 24, npm, Docker.

Run npm install, then copy .env.example to .env.

Start the frontend with npx nx serve web and visit http://localhost:4200.

Start the API with npx nx serve api. It runs at http://localhost:3000/api/v1, with interactive Swagger docs at http://localhost:3000/api/v1/docs.

## Docker

Local infrastructure (PostgreSQL today; Keycloak joins once authentication lands) is defined in docker-compose.yml and started with the infra profile:

docker compose --profile infra up -d postgres

This starts Postgres on localhost:5432 with two databases: opshub (the application database) and opshub_keycloak (reserved for Keycloak's own storage, created automatically via infra/postgres/init).

Stop everything with docker compose down.

## Environment variables

See .env.example for the full list. Never commit .env, it is gitignored; .env.example is the template.

## Testing commands

Run npx nx run-many -t lint test build for everything, or target a single project, for example npx nx test web or npx nx lint api.

Playwright end-to-end tests land in a later phase.

## Roadmap

Phase 1, Nx workspace and architecture: done.
Phase 2, design system and app shell: done.
Phase 3, dashboard: done.
Phase 4, NestJS API foundation and Docker infra: done.
Phase 5, PostgreSQL and Prisma: next.
Phase 6, Keycloak and OIDC authentication: planned.
Phase 7, role-based access control: planned.
Phases 8 through 12, tasks, resources, users, analytics, notifications, audit: planned.
Phase 13, Playwright end-to-end tests: planned.
Phase 14, full Docker stack: planned.
Phase 15, CI/CD: planned.
Phases 16 and 17, performance, accessibility, security review, and polish: planned.
