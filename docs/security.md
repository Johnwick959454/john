# Security & Compliance Audit - Covenant Shield

## 1. Authentication & Authorization
- **JWT Authentication**: Bearer tokens with 24h expiration.
- **Role-Based Access Control (RBAC)**: Enforced via `RolesGuard` on NestJS controllers (`VISITOR`, `CLIENT`, `GUARD`, `SUPERVISOR`, `OPERATIONS`, `SUPER_ADMIN`).
- **Resource-Level Authorization**: Direct database scope checks (`clientId` matching authenticated user profile) on `/api/v1/client-portal` and `/api/v1/cases`.

## 2. Guard Attendance Verification
- **Authoritative Server Timestamps**: Timestamps set exclusively by server clock (`new Date()`).
- **GPS Coordinates & Geofencing**: Distance calculated on server via Haversine algorithm. Status set to `UNVERIFIED` if outside site radius.
- **QR Code Verification**: Secret matched on backend; reusable plain text secrets omitted.

## 3. Data Protection & Caching
- Sensitive client records and guard geolocation data excluded from public caching.
- Password hashes generated using bcrypt (salt rounds: 10).
