# API_REFERENCE.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines the API design standards and endpoint catalog for Companio.

It serves as the authoritative reference for REST API structure, request and response conventions, authentication requirements, error handling, pagination, and versioning.

All backend and frontend development should follow this document.

---

# 2. API Design Principles

Companio APIs should be:

- RESTful
- Versioned
- Stateless
- Predictable
- Secure
- Well documented
- Backward compatible whenever practical

---

# 3. Base URL

Development

```
/api/v1
```

Production

```
https://<domain>/api/v1
```

---

# 4. Authentication

Protected endpoints require an authenticated session or bearer token, depending on the authentication architecture.

Example:

```http
Authorization: Bearer <access_token>
```

---

# 5. Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

## Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed."
  }
}
```

---

# 6. Pagination Standard

Query parameters:

```
?page=1
&pageSize=20
&sort=created_at
&order=desc
```

Response example:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 240,
    "totalPages": 12
  }
}
```

---

# 7. Filtering & Search

Supported query parameters where applicable:

- search
- status
- type
- difficulty
- createdBy
- createdFrom
- createdTo
- sort
- order

Example:

```
GET /questions?search=network&page=1
```

---

# 8. API Modules

## Authentication

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| POST   | `/auth/register`        | Register user          |
| POST   | `/auth/login`           | Login                  |
| POST   | `/auth/logout`          | Logout                 |
| POST   | `/auth/refresh`         | Refresh session        |
| POST   | `/auth/forgot-password` | Password reset request |
| POST   | `/auth/reset-password`  | Reset password         |

---

## User Profile

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | `/users/me`          |
| PATCH  | `/users/me`          |
| GET    | `/users/preferences` |
| PATCH  | `/users/preferences` |

---

## Dashboard

| Method | Endpoint                |
| ------ | ----------------------- |
| GET    | `/dashboard`            |
| GET    | `/dashboard/activity`   |
| GET    | `/dashboard/statistics` |

---

## Learning Sources

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/sources`      |
| POST   | `/sources`      |
| GET    | `/sources/{id}` |
| PATCH  | `/sources/{id}` |
| DELETE | `/sources/{id}` |

---

## Document Processing

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/documents/process`     |
| GET    | `/documents/{id}`        |
| GET    | `/documents/status/{id}` |

---

## AI

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/ai/questions/generate` |
| GET    | `/ai/jobs/{id}`          |
| GET    | `/ai/providers`          |

---

## Question Bank

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | `/questions`      |
| POST   | `/questions`      |
| GET    | `/questions/{id}` |
| PATCH  | `/questions/{id}` |
| DELETE | `/questions/{id}` |

---

## Practice

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/practice/start`       |
| POST   | `/practice/{id}/answer` |
| POST   | `/practice/{id}/finish` |
| GET    | `/practice/history`     |

---

## Assessments

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | `/assessments`              |
| POST   | `/assessments`              |
| PATCH  | `/assessments/{id}`         |
| POST   | `/assessments/{id}/publish` |
| POST   | `/assessments/{id}/archive` |

---

## Assessment Attempts

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| POST   | `/assessment-attempts/start`       |
| POST   | `/assessment-attempts/{id}/answer` |
| POST   | `/assessment-attempts/{id}/submit` |
| GET    | `/assessment-attempts/{id}`        |

---

## Results

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/results/{id}`    |
| GET    | `/results/history` |

---

## Analytics

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | `/analytics/dashboard`   |
| GET    | `/analytics/usage`       |
| GET    | `/analytics/performance` |

---

## Notifications

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | `/notifications`           |
| PATCH  | `/notifications/{id}/read` |
| PATCH  | `/notifications/read-all`  |
| DELETE | `/notifications/{id}`      |

---

## Administration

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | `/admin/users`              |
| PATCH  | `/admin/users/{id}`         |
| GET    | `/admin/settings`           |
| PATCH  | `/admin/settings`           |
| GET    | `/admin/feature-flags`      |
| PATCH  | `/admin/feature-flags/{id}` |

---

# 9. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 202  | Accepted              |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

# 10. Validation Rules

All endpoints should:

- Validate request bodies.
- Validate query parameters.
- Validate route parameters.
- Reject malformed JSON.
- Return consistent validation errors.

---

# 11. Security Guidelines

- Enforce authentication where required.
- Validate authorization on every protected endpoint.
- Apply rate limiting to sensitive operations.
- Never expose secrets or internal identifiers unnecessarily.
- Log security-relevant events.

---

# 12. Versioning

- Current version: `v1`
- Breaking changes require a new API version.
- Non-breaking enhancements should remain within the current version.

---

# 13. Deprecation Policy

When deprecating an endpoint:

1. Mark it as deprecated in documentation.
2. Provide a replacement endpoint.
3. Maintain compatibility for an agreed transition period.
4. Remove only in the next major API version.

---

# 14. AI Agent Guidelines

Before creating or modifying an endpoint, the AI agent should:

1. Check if an appropriate endpoint already exists.
2. Reuse existing request and response formats.
3. Follow REST conventions.
4. Maintain backward compatibility whenever possible.
5. Update this reference with any API additions or changes.

---

# 15. Maintenance

Update this document whenever:

- A new endpoint is added.
- An endpoint is removed.
- Request or response contracts change.
- Authentication or authorization requirements change.
- API versioning is updated.
