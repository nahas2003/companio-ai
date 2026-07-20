# 02_SYSTEM_ARCHITECTURE.md

> **Project:** Companio
>
> **Document:** System Architecture
>
> **Version:** 1.0 (MVP)
>
> **Status:** Draft
>
> **Priority:** Critical
>
> **Depends On:** 00_PROJECT_OVERVIEW.md, 01_PRODUCT_REQUIREMENTS.md

---

# 1. Purpose

This document defines the complete system architecture of Companio.

It establishes how every layer of the application communicates, how responsibilities are separated, and the architectural rules that every developer and AI agent must follow.

No implementation should violate this architecture.

---

# 2. Architecture Goals

The architecture is designed for:

- Simplicity
- Maintainability
- Reusability
- Security
- Scalability
- Testability
- AI-assisted development

---

# 3. High-Level Architecture

```text
                +----------------------+
                |      Frontend        |
                |  React + TypeScript  |
                +----------+-----------+
                           |
                           |
                    Service Layer
                           |
          +----------------+----------------+
          |                                 |
          |                                 |
   Assessment Service                AI Service
          |                                 |
          +----------------+----------------+
                           |
                     Supabase Backend
                           |
        +------------------+------------------+
        |                                     |
 PostgreSQL Database              Storage (PDFs)
                           |
                    AI Provider Gateway
                           |
      +-----------+----------+-----------+
      |           |          |           |
   Gemini       Groq      NVIDIA      Future
```

---

# 4. Layer Responsibilities

## Presentation Layer

Responsible for:

- UI
- User interaction
- Forms
- Navigation
- Validation before API calls

Never:

- Access database directly
- Call AI providers directly

---

## Service Layer

Responsible for:

- Business logic
- API communication
- Validation
- Data transformation
- Error handling

---

## Backend Layer

Responsible for:

- Authentication
- Database operations
- File storage
- Assessment management
- Security
- AI orchestration

---

## Database Layer

Responsible for:

- Persistent storage
- Relationships
- Constraints
- Indexes
- Security policies

---

## AI Layer

Responsible for:

- Prompt creation
- AI provider selection
- Response validation
- Structured output
- Caching

---

# 5. Core Modules

## Authentication

- Login
- Registration
- Session management
- User profile

---

## Practice

Responsible for:

- Topic practice
- PDF practice
- Notes practice

---

## Assessment

Responsible for:

- Assessment creation
- Assessment editing
- Assessment publishing
- Assessment joining

---

## Question Bank

Responsible for:

- AI questions
- Cache
- Reuse
- Validation

---

## Leaderboard

Responsible for:

- Rankings
- Live updates
- Score calculation

---

## Results

Responsible for:

- Score
- History
- Review

---

# 6. Data Flow

## Practice Flow

```text
User

↓

Frontend

↓

Practice Service

↓

AI Gateway

↓

Cache

↓

AI Provider

↓

Question Bank

↓

Frontend

↓

Quiz
```

---

## Assessment Flow

```text
Creator

↓

Upload Content

↓

AI Generation

↓

Question Bank

↓

Assessment Created

↓

Assessment Code

↓

Participants Join

↓

Leaderboard

↓

Results
```

---

# 7. AI Flow

```text
Generate Questions

↓

Normalize Input

↓

Hash Content

↓

Check Cache

↓

Cache Exists?

↓

Yes

↓

Return Cached Questions

↓

No

↓

Generate Prompt

↓

Call AI

↓

Validate JSON

↓

Store Question Bank

↓

Return Questions
```

---

# 8. Security Architecture

Every request passes through:

Input Validation

↓

Authentication Check (when required)

↓

Authorization Check

↓

Business Validation

↓

Database

↓

Response Sanitization

No request bypasses validation.

---

# 9. Folder Responsibility

Every folder has exactly one responsibility.

Example:

```text
components/
Reusable UI only

features/
Business features

services/
API communication

hooks/
Reusable hooks

lib/
Shared libraries

utils/
Pure utility functions

types/
TypeScript types

app/
Routing
```

A folder must never contain unrelated responsibilities.

---

# 10. Architectural Rules

## Rule 1

One responsibility per component.

---

## Rule 2

One responsibility per service.

---

## Rule 3

No duplicated logic.

---

## Rule 4

No component larger than necessary.

Split when complexity increases.

---

## Rule 5

Every API call passes through the Service Layer.

Never call APIs directly from UI components.

---

## Rule 6

Database access only through backend.

Frontend never accesses tables directly except through approved Supabase patterns.

---

## Rule 7

AI providers are hidden behind an abstraction layer.

Changing providers must not affect the frontend.

---

## Rule 8

Business logic never belongs inside UI components.

---

## Rule 9

Shared logic belongs in reusable services or utilities.

---

## Rule 10

Every new feature must integrate into the existing architecture instead of creating parallel implementations.

---

# 11. Scalability Strategy

Future additions should require minimal changes.

Examples:

- New AI provider
- New question type
- Mobile application
- Coding assessments
- Essay evaluation

These should be added by extending existing modules rather than rewriting them.

---

# 12. Error Handling Strategy

Every layer handles its own errors.

Frontend

- Display friendly messages.

Backend

- Log errors.
- Return safe responses.

AI Layer

- Retry safe requests.
- Switch provider if possible.

Database

- Enforce constraints.
- Prevent invalid data.

---

# 13. Logging Strategy

Log:

- Authentication events
- Assessment creation
- AI requests
- AI failures
- Upload failures
- Critical exceptions

Never log:

- Passwords
- Tokens
- API keys
- Sensitive personal information

---

# 14. AI Implementation Rules

Every AI coding agent must:

- Read this architecture before implementation.
- Modify only the required files.
- Never refactor unrelated modules.
- Preserve public interfaces unless explicitly instructed.
- Follow folder responsibilities.
- Reuse existing services.
- Reuse existing components.
- Keep components focused.
- Avoid duplicate code.
- Prefer extension over replacement.

---

# 15. Validation Checklist

Before completing any implementation:

- Project builds successfully.
- No TypeScript errors.
- No lint errors.
- Existing routes still work.
- Existing APIs still work.
- No database schema conflicts.
- No duplicated logic introduced.
- Documentation updated if behavior changed.

If any check fails, the implementation is incomplete.

---

# 16. Dependencies

Depends on:

- 00_PROJECT_OVERVIEW.md
- 01_PRODUCT_REQUIREMENTS.md

Referenced by:

- 03_TECH_STACK.md
- 04_PROJECT_STRUCTURE.md
- 05_DATABASE_ARCHITECTURE.md
- 06_API_SPECIFICATION.md
- 07_SECURITY_ARCHITECTURE.md
- 08_AI_ARCHITECTURE.md
- All feature specification documents
