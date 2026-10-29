# OpsHub

**One workspace for smarter operations.**

OpsHub is an enterprise Operations Management Platform for managing employees, tasks, resources, approvals, teams, and analytics from one centralized system. Built as a demonstration of production-grade full-stack engineering practices: a modular Nx monorepo, Angular with signals, a hardened NestJS API, PostgreSQL, Keycloak-based authentication, and automated end-to-end testing with Playwright.

This project is under active, phased development. The sections below reflect what is actually implemented today; the roadmap at the bottom shows what's coming next.

## Features (implemented so far)

- Enterprise application shell: collapsible sidebar, top navigation, search, light/dark theme with system-preference detection and persistence
- Operational dashboard with KPI cards and live charts (task completion, team performance, resource usage), built on mock data pending real API wiring
- Real authentication through Keycloak using OpenID Connect (Authorization Code flow with PKCE): a branded login page, a route guard, sign out that ends the Keycloak session, and the signed-in user's name and role shown in the top bar
- A hardened NestJS API: Helmet security headers, CORS allowlist, global request validation, Swagger/OpenAPI documentation, and a health endpoint backed by a live database check
- Every API route is protected by default. Tokens are verified against Keycloak's public keys (signature, issuer, audience, expiry), users are provisioned on their first request, and a Public decorator marks the few open routes
- Role based access control: a single permission map shared by the API and the web app, enforced on every API route and mirrored in route guards and the sidebar menu
- A full PostgreSQL schema via Prisma: users, departments, tasks, resources, resource requests, notifications, audit logs, and announcements, with enforced relations and a database-level constraint on resource quantities
- Seed data: three role-based users, departments, sample tasks, a resource, and an announcement, so the database looks realistic immediately after setup

## Architecture

Angular (apps/web) signs users in through Keycloak, then calls the NestJS API (apps/api) with the resulting access token. The API verifies that token, loads or creates the matching user, and talks to PostgreSQL through Prisma.

The workspace is an Nx monorepo using project-reference-based TypeScript, with enforced module boundaries so frontend and backend code can never cross-import, and feature libraries can never import each other directly.

## Authentication

Passwords never touch OpsHub. Keycloak owns identities, sessions, and roles, and OpsHub only ever sees signed tokens.

The browser uses the public client opshub-web with the Authorization Code flow and PKCE. The access token carries the opshub-api audience, which the API requires. Realm roles ADMIN, MANAGER, and EMPLOYEE arrive in the token and are mirrored into the users table on each request, so the database always reflects what Keycloak says.

The realm, its clients, and three development accounts are defined in infra/keycloak/realm-export.json and imported automatically when Keycloak starts. The accounts are admin@opshub.local, manager@opshub.local, and employee@opshub.local, all with the development-only password ChangeMe123!. Change these before any real deployment.

## Authorization

Three roles exist: ADMIN, MANAGER, and EMPLOYEE. Each role holds a set of permissions such as tasks:create or users:manage, defined once in libs/shared/models and used by both the API and the web app, so the two can never disagree. Managers hold everything employees hold, and administrators hold everything managers hold.

The API is the authority. Every route is closed by default: the global JWT guard identifies the caller, then the permissions guard checks the permissions a route declares with the RequirePermissions decorator. A caller who lacks one receives a 403 response that does not reveal which permission was missing, while the server log records the exact reason.

The web app mirrors the rules for a better experience, never for security. Route guards send signed out visitors to the login page and users without access to a Forbidden page, and the sidebar only lists pages the signed in role may open. Hiding a menu item never replaces the check on the server.

## Project structure

apps/web is the Angular application shell and routing. apps/api is the NestJS application bootstrap. apps/web-e2e is the Playwright test suite.

libs/shared/models holds types shared between web and api. libs/shared/util holds framework-agnostic helpers. libs/web/ui is the design system (Button, Badge, Avatar, Input, StatCard, ChartCard, and more). libs/web/shell holds the Sidebar and TopNav. libs/web/auth holds the route guard. libs/web/data-access holds the API client. Each libs/web/feature-* is a lazy-loaded feature library, one per route, including feature-auth for the login page. libs/api/common holds cross-cutting API concerns. libs/api/auth holds token verification, user provisioning, and the global guard. libs/api/prisma holds the Prisma schema, migrations, generated client, PrismaService, and the seed script.

## Local setup

Requirements: Node 22 or 24, npm, Docker.

Run npm install, then copy .env.example to .env.

Start the infrastructure with docker compose --profile infra up -d. This starts PostgreSQL and Keycloak. The first start takes a minute or two while Keycloak imports the realm.

Apply the schema and seed the database (see Database below).

Start the API with npx nx serve api. It runs at http://localhost:3000/api/v1, with interactive Swagger docs at http://localhost:3000/api/v1/docs.

Start the frontend with npx nx serve web, visit http://localhost:4200, and sign in with one of the development accounts listed under Authentication.

## Database

The schema lives in libs/api/prisma/src/schema.prisma, configured through prisma7.config.ts at the repo root.

Apply migrations with npx prisma migrate dev. Generate the Prisma client with npx prisma generate. Seed the database with realistic sample data using npx prisma db seed.

## Docker

Local infrastructure is defined in docker-compose.yml and started with the infra profile: docker compose --profile infra up -d.

PostgreSQL runs on localhost:5432 with two databases: opshub (the application database) and opshub_keycloak (Keycloak's own storage, created automatically via infra/postgres/init). Keycloak runs on localhost:8080, and its admin console is at http://localhost:8080/admin with the development login admin and admin.

Keycloak imports the realm only when it does not already exist. After changing infra/keycloak/realm-export.json, run docker compose down -v to discard the stored data, then start again. This also deletes all database data, so run the migrations and seed afterwards.

Stop everything with docker compose down.

## Environment variables

See .env.example for the full list. Never commit .env, it is gitignored; .env.example is the template. The API reads its port from API_PORT, never a bare PORT, because the Angular dev server also reads PORT and would end up on the wrong port.

## Testing commands

Run npx nx run-many -t lint test build for everything, or target a single project, for example npx nx test web or npx nx lint api.

Playwright end-to-end tests land in a later phase.

## Roadmap

Phase 1, Nx workspace and architecture: done.
Phase 2, design system and app shell: done.
Phase 3, dashboard: done.
Phase 4, NestJS API foundation and Docker infra: done.
Phase 5, PostgreSQL and Prisma: done.
Phase 6, Keycloak and OIDC authentication: done.
Phase 7, role-based access control: done.
Phases 8 through 12, tasks, resources, users, analytics, notifications, audit: next.
Phase 13, Playwright end-to-end tests: planned.
Phase 14, full Docker stack: planned.
Phase 15, CI/CD: planned.
Phases 16 and 17, performance, accessibility, security review, and polish: planned.
