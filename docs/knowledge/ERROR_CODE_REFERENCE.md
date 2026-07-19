# ERROR_CODE_REFERENCE.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines the standardized error codes used throughout Companio.

Its goals are to:

* Provide consistent error handling.
* Improve debugging.
* Simplify frontend error display.
* Improve logging and monitoring.
* Help AI coding agents reuse existing error definitions.

---

# 2. Error Design Principles

Errors should be:

* Predictable
* Human-readable
* Machine-readable
* Consistent
* Actionable
* Properly logged

---

# 3. Error Response Format

Standard API response:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "The provided credentials are invalid.",
    "details": {},
    "traceId": "request-id"
  }
}
```

---

# 4. Error Code Naming Convention

Format:

```text
<CATEGORY>_<DESCRIPTION>
```

Examples:

* AUTH_INVALID_CREDENTIALS
* USER_NOT_FOUND
* QUESTION_DUPLICATE
* FILE_TOO_LARGE

---

# 5. Error Categories

| Prefix       | Description        |
| ------------ | ------------------ |
| AUTH         | Authentication     |
| USER         | User/Profile       |
| VALIDATION   | Request validation |
| FILE         | Upload & storage   |
| AI           | AI services        |
| QUESTION     | Question Bank      |
| PRACTICE     | Practice Mode      |
| ASSESSMENT   | Assessments        |
| RESULT       | Results            |
| NOTIFICATION | Notifications      |
| ADMIN        | Administration     |
| SYSTEM       | Internal platform  |
| NETWORK      | Connectivity       |
| DATABASE     | Data layer         |

---

# 6. Authentication Errors

| Code                     | HTTP | Description                  |
| ------------------------ | ---- | ---------------------------- |
| AUTH_INVALID_CREDENTIALS | 401  | Invalid username or password |
| AUTH_TOKEN_EXPIRED       | 401  | Access token expired         |
| AUTH_TOKEN_INVALID       | 401  | Invalid token                |
| AUTH_SESSION_EXPIRED     | 401  | User session expired         |
| AUTH_ACCESS_DENIED       | 403  | Permission denied            |

---

# 7. Validation Errors

| Code                      | HTTP | Description            |
| ------------------------- | ---- | ---------------------- |
| VALIDATION_FAILED         | 422  | Validation failed      |
| VALIDATION_REQUIRED_FIELD | 422  | Required field missing |
| VALIDATION_INVALID_FORMAT | 422  | Invalid format         |
| VALIDATION_INVALID_VALUE  | 422  | Invalid value          |

---

# 8. File Errors

| Code                    | HTTP | Description               |
| ----------------------- | ---- | ------------------------- |
| FILE_TOO_LARGE          | 413  | Upload exceeds size limit |
| FILE_TYPE_NOT_SUPPORTED | 415  | Unsupported file type     |
| FILE_UPLOAD_FAILED      | 500  | Upload failed             |
| FILE_NOT_FOUND          | 404  | File not found            |
| FILE_PROCESSING_FAILED  | 500  | Processing failed         |

---

# 9. AI Errors

| Code                    | HTTP | Description                |
| ----------------------- | ---- | -------------------------- |
| AI_PROVIDER_UNAVAILABLE | 503  | AI provider unavailable    |
| AI_TIMEOUT              | 504  | AI request timed out       |
| AI_INVALID_RESPONSE     | 502  | Invalid AI response        |
| AI_QUOTA_EXCEEDED       | 429  | Provider quota exceeded    |
| AI_GENERATION_FAILED    | 500  | Question generation failed |

---

# 10. Question Errors

| Code                  | HTTP | Description               |
| --------------------- | ---- | ------------------------- |
| QUESTION_NOT_FOUND    | 404  | Question not found        |
| QUESTION_DUPLICATE    | 409  | Duplicate question        |
| QUESTION_INVALID_TYPE | 422  | Unsupported question type |

---

# 11. Assessment Errors

| Code                         | HTTP | Description               |
| ---------------------------- | ---- | ------------------------- |
| ASSESSMENT_NOT_FOUND         | 404  | Assessment not found      |
| ASSESSMENT_ALREADY_SUBMITTED | 409  | Attempt already submitted |
| ASSESSMENT_TIME_EXPIRED      | 410  | Time limit exceeded       |
| ASSESSMENT_NOT_AVAILABLE     | 403  | Assessment unavailable    |

---

# 12. System Errors

| Code                       | HTTP | Description             |
| -------------------------- | ---- | ----------------------- |
| SYSTEM_INTERNAL_ERROR      | 500  | Unexpected server error |
| SYSTEM_SERVICE_UNAVAILABLE | 503  | Service unavailable     |
| SYSTEM_CONFIGURATION_ERROR | 500  | Configuration issue     |
| SYSTEM_RATE_LIMITED        | 429  | Too many requests       |

---

# 13. User-Facing Messages

Technical error codes should map to friendly messages.

Example:

| Error Code               | User Message                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| AUTH_INVALID_CREDENTIALS | Incorrect email or password. Please try again.                   |
| FILE_TOO_LARGE           | The selected file exceeds the maximum upload size.               |
| AI_TIMEOUT               | The AI service is taking longer than expected. Please try again. |

Avoid exposing stack traces or internal implementation details.

---

# 14. Logging Guidelines

Every error log should include:

* Timestamp
* Error code
* HTTP status
* Request ID / Trace ID
* User ID (if available)
* Module
* Endpoint
* Severity
* Stack trace (server-side only)

---

# 15. Severity Levels

| Level    | Meaning                              |
| -------- | ------------------------------------ |
| INFO     | Informational                        |
| WARNING  | Recoverable issue                    |
| ERROR    | Operation failed                     |
| CRITICAL | Platform stability or security issue |

---

# 16. Recovery Guidance

When possible, define recovery actions.

Examples:

| Error Code              | Suggested Recovery                                    |
| ----------------------- | ----------------------------------------------------- |
| AUTH_TOKEN_EXPIRED      | Refresh authentication and retry.                     |
| FILE_UPLOAD_FAILED      | Retry upload after checking connectivity.             |
| AI_PROVIDER_UNAVAILABLE | Retry later or switch to another configured provider. |
| SYSTEM_RATE_LIMITED     | Wait before sending another request.                  |

---

# 17. AI Agent Guidelines

Before introducing a new error code, the AI agent should:

1. Check if an appropriate code already exists.
2. Follow the naming convention.
3. Use the correct HTTP status.
4. Provide a user-friendly message.
5. Update this reference document.

---

# 18. Maintenance

Update this document whenever:

* A new error code is added.
* An existing error code changes.
* HTTP mappings are modified.
* Recovery guidance changes.
* Logging standards evolve.
