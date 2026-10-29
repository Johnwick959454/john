"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceStatus = exports.CaseStatus = exports.CaseSeverity = exports.CaseType = exports.ServiceRequestStatus = exports.ShiftCoverage = exports.ServiceType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["VISITOR"] = "VISITOR";
    UserRole["CLIENT"] = "CLIENT";
    UserRole["GUARD"] = "GUARD";
    UserRole["SUPERVISOR"] = "SUPERVISOR";
    UserRole["OPERATIONS"] = "OPERATIONS";
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ServiceType;
(function (ServiceType) {
    ServiceType["STATIC_GUARDING"] = "STATIC_GUARDING";
    ServiceType["EVENT_SECURITY"] = "EVENT_SECURITY";
    ServiceType["VIP_ESCORT"] = "VIP_ESCORT";
    ServiceType["PATROL_SERVICES"] = "PATROL_SERVICES";
    ServiceType["CCTV_MONITORING"] = "CCTV_MONITORING";
    ServiceType["OTHER"] = "OTHER";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var ShiftCoverage;
(function (ShiftCoverage) {
    ShiftCoverage["DAY"] = "DAY";
    ShiftCoverage["NIGHT"] = "NIGHT";
    ShiftCoverage["TWENTY_FOUR_HOUR"] = "TWENTY_FOUR_HOUR";
})(ShiftCoverage || (exports.ShiftCoverage = ShiftCoverage = {}));
var ServiceRequestStatus;
(function (ServiceRequestStatus) {
    ServiceRequestStatus["NEW"] = "NEW";
    ServiceRequestStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    ServiceRequestStatus["SITE_ASSESSMENT_SCHEDULED"] = "SITE_ASSESSMENT_SCHEDULED";
    ServiceRequestStatus["QUOTATION_SENT"] = "QUOTATION_SENT";
    ServiceRequestStatus["ACCEPTED"] = "ACCEPTED";
    ServiceRequestStatus["CONTRACT_ACTIVE"] = "CONTRACT_ACTIVE";
    ServiceRequestStatus["REJECTED"] = "REJECTED";
    ServiceRequestStatus["CANCELLED"] = "CANCELLED";
})(ServiceRequestStatus || (exports.ServiceRequestStatus = ServiceRequestStatus = {}));
var CaseType;
(function (CaseType) {
    CaseType["COMPLAINT"] = "COMPLAINT";
    CaseType["COMPLIMENT"] = "COMPLIMENT";
    CaseType["SUGGESTION"] = "SUGGESTION";
    CaseType["GENERAL_FEEDBACK"] = "GENERAL_FEEDBACK";
})(CaseType || (exports.CaseType = CaseType = {}));
var CaseSeverity;
(function (CaseSeverity) {
    CaseSeverity["LOW"] = "LOW";
    CaseSeverity["MEDIUM"] = "MEDIUM";
    CaseSeverity["HIGH"] = "HIGH";
    CaseSeverity["CRITICAL"] = "CRITICAL";
})(CaseSeverity || (exports.CaseSeverity = CaseSeverity = {}));
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["SUBMITTED"] = "SUBMITTED";
    CaseStatus["ASSIGNED"] = "ASSIGNED";
    CaseStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CaseStatus["RESOLUTION_PROPOSED"] = "RESOLUTION_PROPOSED";
    CaseStatus["CLOSED"] = "CLOSED";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EARLY_DEPARTURE"] = "EARLY_DEPARTURE";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["UNVERIFIED"] = "UNVERIFIED";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
