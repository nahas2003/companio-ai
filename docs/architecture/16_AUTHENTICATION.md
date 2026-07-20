# 16_AUTHENTICATION.md

> **Project:** Companio
> **Document:** Identity, Authentication & Authorization
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–15

---

# 1. Purpose

This document defines how identities are created, authenticated, and authorized within Companio.

It separates:

- Identity
- Authentication
- Authorization

These concepts must remain independent.

---

# 2. Objectives

The system should:

- Support frictionless guest participation.
- Support registered users.
- Support assessment creators.
- Support administrators.
- Allow future expansion without redesign.

---

# 3. Identity Levels

```text id="auth001"
Anonymous
     │
     ▼
Guest
     │
     ▼
Registered User
     │
     ▼
Creator
     │
     ▼
Administrator
```

Each level inherits the capabilities of the previous level.

---

# 4. Identity Model

## Anonymous

Not identified.

Can:

- Browse public pages.

Cannot:

- Join assessments.
- Create assessments.

---

## Guest

Identified by:

- Display name
- Temporary session identifier

Can:

- Join assessments.
- Practice.
- View own results.

Cannot:

- Create assessments.
- Access dashboards.
- Save long-term history.

---

## Registered User

Authenticated account.

Can:

- Save history.
- Practice.
- Reuse Question Banks.
- Manage profile.

---

## Creator

Registered user with creator permissions.

Can:

- Create assessment templates.
- Publish assessments.
- View analytics.
- Manage owned Question Banks.

---

## Administrator

Platform administrator.

Can:

- Manage users.
- Moderate public content.
- View platform analytics.
- Manage system configuration.

---

# 5. Authentication Methods

MVP:

- Email and password.

Future:

- Google OAuth.
- Microsoft OAuth.
- GitHub OAuth.
- Magic links.
- Passkeys.

---

# 6. Guest Flow

```text id="auth002"
Open Assessment
      │
      ▼
Enter Display Name
      │
      ▼
Create Temporary Identity
      │
      ▼
Join Assessment
```

No permanent account is created.

---

# 7. Registration Flow

```text id="auth003"
Sign Up
    │
    ▼
Verify Credentials (if enabled)
    │
    ▼
Create User
    │
    ▼
Authenticated Session
```

---

# 8. Login Flow

```text id="auth004"
Login
   │
   ▼
Validate Credentials
   │
   ▼
Create Session
   │
   ▼
Load Profile
```

---

# 9. Session Management

Sessions should:

- Expire securely.
- Support logout.
- Refresh safely.
- Prevent session fixation.

---

# 10. Authorization

Access decisions should be based on:

- Identity level.
- Resource ownership.
- Assigned permissions.

Never rely solely on client-side checks.

---

# 11. Resource Ownership

Creators may manage only resources they own.

Examples:

- Sources
- Question Banks
- Assessment Templates
- Published Assessments

Ownership must always be verified on the server.

---

# 12. Guest Upgrade

A guest should be able to create an account later.

Where practical, completed activities may be linked to the new account after verification.

This feature is optional for the MVP but should be supported by the architecture.

---

# 13. APIs

Primary endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `GET /users/me`

---

# 14. Database Usage

Primary entities:

- users
- participants
- sessions (managed by authentication provider where applicable)

---

# 15. Security

Requirements:

- Passwords stored securely by the authentication provider.
- Tokens never exposed unnecessarily.
- Authorization verified server-side.
- Rate limits applied to authentication endpoints.

---

# 16. Error Handling

Handle:

- Invalid credentials.
- Expired sessions.
- Unauthorized access.
- Permission denied.
- Duplicate accounts.

Provide user-friendly messages without revealing sensitive information.

---

# 17. Future Enhancements

- Multi-factor authentication.
- Organization roles.
- Team workspaces.
- Single Sign-On (SSO).
- Fine-grained permissions.

---

# 18. AI Implementation Rules

Every AI coding agent must:

- Keep identity, authentication, and authorization separate.
- Never bypass ownership checks.
- Respect role boundaries.
- Avoid embedding permission logic in UI components.
- Follow the Security Architecture.

---

# 19. Acceptance Criteria

The feature is complete when:

- Guests can join assessments.
- Registered users can authenticate.
- Creators can manage their resources.
- Administrators have elevated capabilities.
- Authorization is enforced.
- Ownership checks are implemented.
- Security requirements are satisfied.

---

# 20. Dependencies

Depends on:

- 00–15

Referenced by:

- 17_LEADERBOARD.md
- 18_RESULTS_AND_HISTORY.md
- Future administration features.
