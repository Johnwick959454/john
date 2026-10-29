# Security & Permissions Documentation - Covenant Shield Platform

## Roles
1. `VISITOR`: Unauthenticated user. Can submit service requests & complaints; track requests via reference + phone verification.
2. `CLIENT`: Authenticated client. Access restricted strictly to own company requests, cases, authorized sites, and messages.
3. `GUARD`: Guard user. Mobile PWA interface. Can view own shift schedule, submit check-in/out with GPS/QR, view own attendance.
4. `SUPERVISOR`: Operational site supervisor. Can view assigned sites, review attendance exceptions for assigned sites, handle site complaints.
5. `OPERATIONS`: Operational staff. Full management of requests, complaints, clients, sites, employees, shifts, and reports.
6. `SUPER_ADMIN`: Administrative lead. User account management, system settings, global audit logs.

## Security Rules
- Authorization logic enforced on backend via NestJS Guards & Resource Ownership checks.
- Sensitive client and attendance data marked as non-cacheable.
- Password hashing using bcrypt.
- Timestamps recorded in UTC; presented in East Africa Time (UTC+3).
