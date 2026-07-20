# 16_CODING_STANDARDS.md

> **Project:** Companio
> **Document:** Coding Standards & Development Conventions
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines the coding standards for the Companio project.

Its goal is to ensure consistency, maintainability, readability, and scalability across the codebase, whether code is written by human developers or AI coding agents.

---

# 2. Objectives

After adopting these standards:

- Code follows consistent conventions.
- Architecture remains modular.
- Code reviews become easier.
- AI-generated code matches project expectations.
- Technical debt is minimized.

---

# 3. Core Principles

Every contribution should be:

- Readable
- Maintainable
- Modular
- Testable
- Secure
- Reusable
- Predictable

Prefer clarity over cleverness.

---

# 4. Project Structure

Follow the agreed feature-based architecture.

Example:

```text
src/
├── app/
├── components/
├── features/
├── services/
├── hooks/
├── lib/
├── types/
├── utils/
└── styles/
```

Do not place unrelated files in shared folders.

---

# 5. Naming Conventions

## Files

- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Utilities: `camelCase.ts`
- Types: `types.ts`
- Constants: `constants.ts`

## Variables

Use descriptive `camelCase` names.

Avoid abbreviations unless universally understood.

## Components

Use `PascalCase`.

## Interfaces / Types

Use `PascalCase`.

## Functions

Use verbs describing behavior.

Examples:

- `createAssessment`
- `generateQuestionBank`
- `calculateScore`

---

# 6. Component Design

Each component should have a single responsibility.

Prefer composition over inheritance.

Large components should be split into smaller reusable parts.

Avoid components exceeding roughly 300 lines unless justified.

---

# 7. State Management

Keep state:

- Local when possible.
- Shared only when necessary.

Avoid duplicating the same state in multiple places.

Derived state should be computed rather than stored.

---

# 8. API Layer

Never call backend services directly from UI components.

Use a dedicated API/service layer.

Benefits:

- Easier testing
- Better reuse
- Centralized error handling

---

# 9. Error Handling

Do not ignore errors.

Every asynchronous operation should:

- Handle expected failures.
- Log appropriate details.
- Return meaningful error messages.
- Avoid exposing sensitive information.

---

# 10. Type Safety

Use TypeScript consistently.

Avoid:

- `any`
- Unsafe type assertions
- Ignoring compiler errors

Prefer explicit types where they improve clarity.

---

# 11. Validation

Validate:

- User input
- API requests
- API responses
- AI-generated output
- Environment configuration

Never rely solely on client-side validation.

---

# 12. Code Formatting

Use automated formatting tools.

Maintain consistent:

- Indentation
- Line length
- Imports
- Spacing

Formatting should be enforced automatically where possible.

---

# 13. Comments

Write comments only when they add value.

Prefer explaining **why** rather than **what**.

Remove outdated comments during code changes.

---

# 14. Logging

Log:

- Errors
- Important lifecycle events
- Background jobs
- AI workflow execution
- Deployment events

Do not log secrets or sensitive user data.

---

# 15. Performance Guidelines

Avoid:

- Unnecessary re-renders
- Duplicate API requests
- Inefficient database queries
- Premature optimization

Measure performance before optimizing.

---

# 16. Security Guidelines

Always:

- Validate input.
- Enforce authorization.
- Sanitize user-generated content.
- Protect secrets.
- Use secure defaults.

Never trust client input.

---

# 17. Testing Expectations

Every feature should include:

- Unit tests for business logic.
- Integration tests where appropriate.
- Manual verification of key user flows.

Critical functionality should not be merged without adequate testing.

---

# 18. Pull Request Expectations

Every pull request should:

- Build successfully.
- Pass automated tests.
- Follow coding standards.
- Include a clear description.
- Be limited to a focused scope.

Avoid combining unrelated changes.

---

# 19. AI Coding Guidelines

AI-generated code should:

- Respect project architecture.
- Avoid introducing duplicate implementations.
- Reuse existing services and utilities.
- Follow naming conventions.
- Include appropriate validation.
- Avoid speculative features not defined in project documents.

Generated code should always be reviewed before merging.

---

# 20. Common Mistakes

Avoid:

- Large monolithic components.
- Business logic inside UI components.
- Hardcoded configuration values.
- Circular dependencies.
- Duplicate utilities.
- Inconsistent naming.

---

# 21. Acceptance Criteria

The coding standards are successfully adopted when:

- New code follows the documented conventions.
- AI-generated code integrates cleanly.
- Code reviews focus on design rather than formatting.
- The codebase remains consistent over time.

---

# 22. Definition of Done

Coding standards are considered established when:

- They are documented.
- They are understood by contributors.
- They are enforced through tooling and reviews.
- They are referenced during AI-assisted development.

---

# 23. Next Development Module

Proceed to:

**17_GIT_WORKFLOW.md**
