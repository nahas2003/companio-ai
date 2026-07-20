# 03_AUTHENTICATION.md

> **Project:** Companio
> **Document:** Authentication Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document provides the implementation guide for the Authentication and Authorization module.

It translates the architecture into executable development tasks and defines the expected implementation sequence, folder structure, security requirements, and testing procedures.

Authentication is the foundation for all protected features in Companio.

---

# 2. Objectives

After completing this module:

- Users can securely authenticate.
- Guest users can participate where permitted.
- Sessions are managed correctly.
- Role-Based Access Control (RBAC) is operational.
- Protected routes enforce permissions.
- Authentication integrates with Supabase Auth.

---

# 3. Prerequisites

Complete before starting:

- 00_MASTER_DEVELOPMENT_PLAN.md
- 01_PROJECT_SETUP.md
- 02_DATABASE_SETUP.md

Review architecture:

- 02_SYSTEM_ARCHITECTURE.md
- 05_DATABASE_ARCHITECTURE.md
- 16_AUTHENTICATION.md
- 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement a secure authentication system using Supabase Authentication while keeping business logic modular and reusable.

## Expected Output

A fully functional authentication system with:

- Login
- Registration
- Logout
- Session persistence
- Protected routes
- Role handling
- Guest access

## Files Allowed to Modify

- Authentication feature folder
- Routing configuration
- Supabase client
- Context providers
- Environment configuration

## Files That Must NOT Be Modified

- Unrelated feature modules
- Question Bank
- AI Engine
- Assessment logic

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── pages/
│       ├── types/
│       └── utils/
│
├── providers/
│
├── routes/
│
└── lib/
```

---

# 6. Implementation Order

Implement in the following order:

1. Configure Supabase Auth client.
2. Create authentication provider.
3. Implement session management.
4. Create login page.
5. Create registration page.
6. Implement logout.
7. Create authentication hooks.
8. Implement protected routes.
9. Implement role guards.
10. Add guest access support.
11. Handle authentication errors.
12. Test complete authentication flow.

Do not skip steps.

---

# 7. Frontend Tasks

Create:

- Login page
- Registration page
- Forgot password page (optional for MVP)
- Loading indicators
- Authentication forms
- Error messages
- Protected layout
- Guest entry flow

Requirements:

- Responsive UI
- Accessible forms
- Client-side validation
- Loading states
- Error feedback

---

# 8. Backend Tasks

Configure:

- Supabase Auth
- Email authentication
- Session persistence
- Token refresh
- Role retrieval
- Profile synchronization

Implement secure communication between frontend and Supabase.

---

# 9. Database Tasks

Create or verify:

- User profile table (if separate from Supabase Auth)
- Role definitions
- Profile metadata
- User preferences (future-ready)

Validate foreign keys and RLS policies.

---

# 10. State Management

Authentication state should include:

- Current user
- Session
- Authentication status
- User role
- Loading state
- Error state

State should be globally accessible.

---

# 11. Routing

Implement:

- Public routes
- Protected routes
- Guest routes
- Role-restricted routes

Redirect users appropriately after authentication.

---

# 12. Validation Rules

Validate:

- Email format
- Password requirements
- Required fields
- Duplicate accounts
- Session validity

Display user-friendly error messages.

---

# 13. Security Requirements

Authentication must:

- Never expose secret keys.
- Never trust client-side roles.
- Use Row Level Security.
- Refresh expired sessions.
- Sanitize user input.
- Protect against unauthorized access.

---

# 14. Testing Checklist

Verify:

- Registration succeeds.
- Login succeeds.
- Invalid login fails gracefully.
- Logout clears session.
- Session persists after refresh.
- Protected routes deny unauthorized users.
- Role restrictions work.
- Guest access behaves correctly.

---

# 15. Acceptance Criteria

This module is complete when:

- Authentication works end-to-end.
- Session persistence is verified.
- Protected routes function correctly.
- Role checks are enforced.
- Tests pass.
- Documentation is updated.

---

# 16. Common Mistakes

Avoid:

- Hardcoding credentials.
- Storing secrets in the frontend.
- Mixing authentication logic with UI.
- Skipping session validation.
- Trusting client-side permissions.

---

# 17. Definition of Done

The module is considered complete when:

- All objectives are met.
- Code follows project standards.
- Security checks pass.
- Manual testing succeeds.
- AI agent outputs require no architectural changes.

---

# 18. Next Development Module

Proceed to:

**04_AI_ORCHESTRATOR.md**
