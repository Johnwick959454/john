# Covenant Shield Security Services Management System

Covenant Shield is a complete, secure, responsive, production-oriented security-services management platform.

## Architecture & Structure

Monorepo using npm workspaces:
- `apps/web`: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Lucide icons.
- `apps/api`: NestJS, TypeScript, Prisma ORM, PostgreSQL, REST API (`/api/v1`).
- `packages/shared`: Shared TypeScript types, interfaces, DTO definitions, and schemas.
- `docs/`: Comprehensive documentation.

## Brand Identity & Design Tokens

- **Primary Emerald Green**: `#003C35`
- **Royal Gold Accent**: `#C9A04A`
- **Dark Forest Green**: `#092824`
- **Light Background Grey**: `#F4F6F4`
- **Main Text**: `#24332F`
- **White**: `#FFFFFF`

## Getting Started

### Prerequisites
- Node.js (v18+) & npm (v9+)
- Docker & Docker Compose (for PostgreSQL)

### Setup & Run
1. Start PostgreSQL:
   ```bash
   docker-compose up -d
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run API:
   ```bash
   cd apps/api && npm run start:dev
   ```
4. Run Web Frontend:
   ```bash
   cd apps/web && npm run dev
   ```
