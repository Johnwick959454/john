# Architecture Documentation - Covenant Shield Platform

## Overview
Covenant Shield is designed as a modular monolith providing four primary interfaces:
1. Public Company Website & Service Requests / Complaint tracking.
2. Client Portal.
3. Guard Mobile Web Application / PWA.
4. Operations & Admin Dashboard.

## Technology Stack
- **Frontend**: React (TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React).
- **Backend**: NestJS (TypeScript, Prisma ORM, REST API under `/api/v1`, Swagger OpenAPI).
- **Database**: PostgreSQL 16.
- **Shared**: `@covenant-shield/shared` monorepo package for strict contract types.

## Monorepo Layout
```
covenant-shield/
  apps/
    web/       # React Vite frontend
    api/       # NestJS backend REST API
  packages/
    shared/    # Shared TypeScript types & Enums
  docs/        # System & Deployment Architecture Docs
```
