# 003_USER_PROFILE.md

> **Project:** Companio
> **Task ID:** 003
> **Task Name:** User Profile & Account Management
> **Priority:** High
> **Estimated Complexity:** Medium

---

# 1. Purpose

Implement the user profile and account management module.

This task focuses on user identity after authentication has been established. It enables users to view and manage their own account information while keeping authorization and permissions out of scope.

---

# 2. Objective

At the end of this task, authenticated users should be able to:

- View their profile.
- Update allowed profile information.
- View account metadata.
- Manage basic account preferences.
- View account status.

---

# 3. Scope

Included:

- User profile page
- Profile information
- Avatar support (optional in V1)
- Profile editing
- Account preferences
- Profile validation
- Profile persistence

---

# 4. Out of Scope

Do **not** implement:

- User administration
- Role management
- Permissions
- Team management
- Dashboard widgets
- AI functionality
- Question Bank
- Practice Mode
- Assessments

These are covered by later tasks.

---

# 5. Required Reading

## Architecture

- 00_MASTER_PROJECT_SPECIFICATION.md
- 01_SYSTEM_ARCHITECTURE.md
- User/Profile architecture documents
- 21_PROJECT_CONSTITUTION.md

## Development

- 16_CODING_STANDARDS.md
- 18_ENVIRONMENT_CONFIGURATION.md
- 19_ERROR_HANDLING.md
- 22_SECURITY_CHECKLIST.md
- 24_AI_AGENT_WORKFLOW.md

---

# 6. Prerequisites

Task **002_AUTHENTICATION.md** must be completed.

Verify:

- Authentication is operational.
- Sessions persist correctly.
- Protected routes function as expected.

---

# 7. Files Allowed to Modify

The AI may modify:

- User profile pages
- Profile components
- Account services
- Profile validation
- Shared user utilities
- Profile API handlers
- Database models related to user profiles

---

# 8. Files Not to Modify

Do **not** modify:

- Authentication logic
- RBAC implementation
- Dashboard
- AI modules
- Question Bank
- Practice Mode
- Assessment modules
- Notifications

If changes outside this scope appear necessary, document them instead of implementing them.

---

# 9. Database Changes

Allowed:

- User profile table (if separate)
- Profile metadata fields
- User preferences
- Required indexes
- RLS updates related to profile ownership

Do not introduce unrelated business entities.

---

# 10. API Changes

Implement only profile-related APIs:

- Get current profile
- Update profile
- Validate profile updates

No administrative APIs.

---

# 11. Frontend Tasks

Implement:

- Profile page
- Profile form
- Validation
- Loading states
- Success and error feedback
- Unsaved changes handling

---

# 12. Backend Tasks

Implement:

- Profile service
- Update logic
- Ownership validation
- Server-side validation
- Audit logging for profile updates (where appropriate)

---

# 13. AI Implementation Rules

The AI must:

- Allow users to access only their own profile.
- Validate all user input.
- Reuse shared form and validation components where possible.
- Keep profile logic separate from authentication.
- Avoid introducing permission systems in this task.

---

# 14. Implementation Checklist

- Profile page created
- Profile retrieval implemented
- Profile updates supported
- Validation completed
- Error handling implemented
- Persistence verified

---

# 15. Testing Checklist

Verify:

- Profile loads correctly.
- Profile updates save successfully.
- Invalid data is rejected.
- Users cannot modify another user's profile.
- Validation messages are clear.

---

# 16. Acceptance Criteria

Task is complete when:

- Authenticated users can manage their own profile.
- Updates persist correctly.
- Ownership is enforced.
- Code follows project standards.

---

# 17. Definition of Done

The profile module is complete when:

- Users can view their account information.
- Users can update permitted fields.
- Validation and persistence work correctly.
- Tests pass.
- Documentation remains consistent.

---

# 18. Deliverables

Expected outputs:

- User profile page
- Profile service
- Update functionality
- Validation logic
- Supporting tests

---

# 19. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the functionality described in this task.

Do not modify unrelated modules.

Follow the project's coding standards, security checklist, and AI workflow.

Run all applicable tests before completion.

Provide a summary of changes, files modified, and testing results.

---

# 20. Next Task

Proceed to:

**004_RBAC.md**
