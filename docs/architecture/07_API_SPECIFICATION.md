# 07_API_SPECIFICATION.md

> **Project:** Companio
> **Document:** API Specification
> **Version:** 1.0 (MVP)
> **Priority:** Critical
> **Depends On:** 00–06

---

# 1. Purpose

This document defines the official API contract for Companio.

The API is the single communication layer between:

* Web Frontend
* Mobile Application
* AI Services
* Backend Services
* Future Third-Party Integrations

Every implementation must follow this specification.

---

# 2. API Design Principles

The API must be:

* RESTful
* Predictable
* Versioned
* Secure
* Consistent
* Stateless
* Easy to document
* Easy to test

---

# 3. Base URL

```text
/api/v1
```

Future breaking changes must introduce a new version (for example, `/api/v2`) rather than changing existing endpoints.

---

# 4. Standard Response Format

## Success

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully."
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "The provided data is invalid."
  }
}
```

All endpoints must follow this structure.

---

# 5. Authentication

## Public Endpoints

Accessible without login.

Examples:

* Practice
* Join Assessment
* View Public Leaderboard

---

## Protected Endpoints

Require authentication.

Examples:

* Create Assessment
* Update Assessment
* Delete Assessment
* View Dashboard
* Manage Question Banks

---

# 6. API Modules

The API is divided into the following modules:

* Authentication
* Sources
* Question Banks
* Questions
* Practice
* Assessments
* Participants
* Attempts
* Leaderboards
* Users
* AI
* Uploads

Each module owns its own endpoints.

---

# 7. Authentication API

## Login

```text
POST /auth/login
```

Purpose:

Authenticate a registered user.

---

## Logout

```text
POST /auth/logout
```

---

## Session

```text
GET /auth/session
```

---

# 8. Sources API

## Upload Source

```text
POST /sources
```

Supports:

* PDF
* Topic
* Notes

Returns:

* Source ID
* Processing Status

---

## Source Details

```text
GET /sources/{id}
```

---

# 9. Question Bank API

## Generate Question Bank

```text
POST /question-banks
```

Workflow:

* Check cache
* Generate AI questions if needed
* Store question bank
* Return identifier

---

## Get Question Bank

```text
GET /question-banks/{id}
```

---

## List Question Banks

```text
GET /question-banks
```

Supports:

* Pagination
* Search
* Filtering

---

# 10. Practice API

## Start Practice

```text
POST /practice/start
```

Returns:

* Practice session
* Questions

---

## Submit Practice

```text
POST /practice/submit
```

Returns:

* Score
* Correct answers
* Explanations

Practice sessions are not added to assessment leaderboards.

---

# 11. Assessment API

## Create Assessment

```text
POST /assessments
```

---

## Update Assessment

```text
PUT /assessments/{id}
```

---

## Publish Assessment

```text
POST /assessments/{id}/publish
```

Returns:

* Assessment Code

---

## Get Assessment

```text
GET /assessments/{id}
```

---

## Join Assessment

```text
POST /assessments/{code}/join
```

Supports:

* Guest participant
* Registered participant

---

# 12. Attempt API

## Start Attempt

```text
POST /attempts/start
```

---

## Submit Attempt

```text
POST /attempts/{id}/submit
```

Returns:

* Score
* Time Taken
* Rank (if available)

---

## Attempt Details

```text
GET /attempts/{id}
```

---

# 13. Leaderboard API

## Assessment Leaderboard

```text
GET /leaderboards/{assessmentId}
```

Returns:

* Ranking
* Score
* Time Taken
* Participant Name

---

# 14. User API

## Dashboard

```text
GET /users/me/dashboard
```

---

## Assessment History

```text
GET /users/me/history
```

---

## Profile

```text
GET /users/me/profile
```

---

# 15. AI API

## Generate Questions

```text
POST /ai/questions
```

This endpoint is intended for internal backend orchestration and should not be exposed directly to the client.

---

# 16. Upload API

## Upload PDF

```text
POST /uploads/pdf
```

Returns:

* Upload ID
* Storage Path
* Processing Status

---

# 17. Pagination

Collection endpoints should support:

```text
?page=1
&pageSize=20
```

Response example:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 145,
    "totalPages": 8
  }
}
```

---

# 18. Filtering and Search

Recommended query parameters:

* `search`
* `status`
* `sort`
* `order`

Example:

```text
GET /question-banks?search=networking&sort=createdAt&order=desc
```

---

# 19. HTTP Status Codes

Use standard status codes consistently:

* 200 OK
* 201 Created
* 204 No Content
* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 422 Unprocessable Entity
* 429 Too Many Requests
* 500 Internal Server Error

---

# 20. Validation Rules

Every endpoint must:

* Validate input.
* Validate authentication where required.
* Validate authorization.
* Sanitize output.
* Return consistent error messages.

---

# 21. Rate Limiting

Recommended defaults:

* Public endpoints: 60 requests/minute/IP
* Authenticated endpoints: 300 requests/minute/user
* AI generation endpoints: lower limits to prevent abuse

These values can be adjusted based on deployment needs.

---

# 22. Idempotency

Operations that create resources (such as assessment creation) should support idempotency where appropriate to avoid duplicate resources when clients retry requests after network failures.

---

# 23. API Naming Rules

* Use plural resource names.
* Use nouns rather than verbs where practical.
* Keep URLs lowercase.
* Avoid exposing implementation details.

Examples:

* `/assessments`
* `/question-banks`
* `/attempts`

---

# 24. AI Implementation Rules

Every AI coding agent must:

* Follow the documented endpoints.
* Preserve request and response contracts.
* Avoid introducing undocumented APIs.
* Maintain backward compatibility within the same API version.
* Update this document if a new endpoint is added.

---

# 25. Validation Checklist

Before releasing an API change:

* Endpoint implemented.
* Authentication verified.
* Authorization verified.
* Input validation complete.
* Error responses standardized.
* Documentation updated.
* Existing endpoints remain compatible.
* Automated tests added or updated.

---

# 26. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md
* 04_PROJECT_STRUCTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_BUSINESS_WORKFLOWS.md

Referenced by:

* 08_SECURITY_ARCHITECTURE.md
* 09_AI_ARCHITECTURE.md
* All implementation documents.
