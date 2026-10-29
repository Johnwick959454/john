# Database Documentation - Covenant Shield Platform

## Database Engine
PostgreSQL with Prisma ORM.

## Schema Entities
- `User`: Accounts with authentication, hashed passwords, and system roles.
- `Client`: Customer profile associated with `User`.
- `Employee`: Guards, supervisors, and operations personnel records.
- `Site`: Physical security locations with coordinates, geofences, and site QR secrets.
- `SiteSupervisorAssignment`: Mapping between sites and assigned supervisors.
- `ServiceRequest`: Service requests submitted by visitors or clients (`SR-2026-XXXXX`).
- `RequestStatusHistory`: Tracking timeline and audit history for service requests.
- `Quotation`: Quotations associated with service requests.
- `Case`: Feedback and complaint tickets (`CS-2026-XXXXX`).
- `CaseMessage`: Communication threads between client and ops (supporting internal-only notes).
- `CaseAttachment`: Uploaded documents/photos (up to 3 files, max 5MB each).
- `CaseStatusHistory`: Audit log for complaint resolution lifecycle.
- `Shift`: Guard schedule assignments (timestamps stored in UTC).
- `AttendanceRecord`: Check-in/check-out events validated with authoritative server timestamps, GPS geofences, and QR codes.
- `AttendanceCorrection`: Audited manual adjustments to attendance.
- `AuditLog`: System security and administrative event log.
