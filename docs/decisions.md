# Architectural Decisions & Known Limitations

## Decisions Log
1. **Modular Monorepo Structure**: Standardized on npm workspaces (`apps/web`, `apps/api`, `packages/shared`) for simplicity, type safety, and zero overhead compared to complex microservices.
2. **NestJS + Prisma + PostgreSQL**: Solid enterprise backend stack providing declarative DTO validation (`class-validator`), migrations, and strict type safety.
3. **Design System & Visual Token Consistency**: Defined Tailwind color palette (`emerald-900: #003C35`, `gold-500: #C9A04A`, `emerald-950: #092824`) applied across public website, client portal, operations dashboard, and guard mobile PWA.

## Known Limitations & Future Enhancements
- **SMS / Email Carrier Integration**: Development mock notification providers currently log delivery events to stdout; SMS gateway integration (e.g., Twilio / local telecom API) recommended for Phase 5 production rollout.
- **Offline Guard Synchronization**: Offline check-ins rely on active PWA browser connectivity; background sync service worker queueing to be expanded in future release.
