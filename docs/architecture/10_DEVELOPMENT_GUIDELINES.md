# 10_DEVELOPMENT_GUIDELINES.md

> **Project:** Companio
> **Document:** Development Guidelines
> **Version:** 1.0 (MVP)
> **Priority:** Critical
> **Depends On:** 00–09

---

# 1. Purpose

This document defines the engineering standards for Companio.

Every developer and AI coding agent must follow these guidelines to ensure the codebase remains:

* Consistent
* Maintainable
* Secure
* Testable
* Scalable

These guidelines apply to every change, regardless of size.

---

# 2. Development Principles

Every contribution should prioritize:

* Simplicity over cleverness.
* Readability over brevity.
* Reuse over duplication.
* Composition over inheritance.
* Explicit behavior over hidden behavior.

---

# 3. General Coding Standards

Code should:

* Be easy to read.
* Be self-documenting where practical.
* Use meaningful names.
* Avoid unnecessary abstractions.
* Avoid premature optimization.

---

# 4. Naming Conventions

Variables:

* `camelCase`

Functions:

* `camelCase`

Components:

* `PascalCase`

Types and Interfaces:

* `PascalCase`

Constants:

* `UPPER_SNAKE_CASE`

Files:

* Follow the conventions defined in `04_PROJECT_STRUCTURE.md`.

---

# 5. Function Design

Functions should:

* Have one responsibility.
* Return predictable results.
* Minimize side effects.
* Validate inputs when appropriate.

Prefer smaller functions over large, multi-purpose functions.

---

# 6. Component Design

Components should:

* Focus on presentation.
* Receive data through props.
* Delegate business logic to services or hooks.
* Remain reusable when practical.

---

# 7. Service Design

Services should:

* Encapsulate business logic.
* Handle API communication.
* Be stateless.
* Be independently testable.

---

# 8. Error Handling

Rules:

* Handle expected errors gracefully.
* Avoid empty `catch` blocks.
* Return meaningful error messages.
* Log technical details without exposing them to users.

---

# 9. Testing Expectations

Every feature should include appropriate tests.

Recommended categories:

* Unit tests
* Integration tests
* End-to-end tests (for critical workflows)

Critical workflows should always be tested before release.

---

# 10. Documentation

Update documentation whenever:

* A public API changes.
* Database schema changes.
* Business workflow changes.
* Security behavior changes.
* AI behavior changes.

Documentation is part of the implementation, not an optional task.

---

# 11. Git Workflow

Recommended branch naming:

* `feature/...`
* `bugfix/...`
* `hotfix/...`
* `docs/...`
* `refactor/...`

Commit messages should be concise and descriptive.

Examples:

* `feat: add assessment publishing`
* `fix: prevent duplicate attempts`
* `docs: update AI architecture`

---

# 12. Code Reviews

Every change should verify:

* Correctness
* Readability
* Security
* Performance
* Documentation
* Test coverage

Reviewers should understand the intent of the change before approving it.

---

# 13. Dependency Management

Before adding a dependency:

1. Check if the functionality already exists.
2. Prefer native APIs where practical.
3. Evaluate maintenance and community support.
4. Consider bundle size.
5. Document the reason for introducing the dependency.

---

# 14. Performance Guidelines

* Avoid unnecessary renders.
* Use lazy loading where appropriate.
* Reuse cached data.
* Optimize expensive operations.
* Measure before optimizing.

---

# 15. Accessibility

Aim for:

* Keyboard navigation.
* Proper semantic HTML.
* Accessible form labels.
* Sufficient color contrast.
* Screen reader compatibility where feasible.

Accessibility should be considered from the start rather than added later.

---

# 16. Security Awareness

Developers must:

* Validate input.
* Avoid exposing secrets.
* Follow the Security Architecture.
* Use least privilege.
* Respect authentication and authorization boundaries.

---

# 17. AI-Assisted Development

When using AI:

* Provide relevant project documents.
* Review generated code before merging.
* Verify generated tests.
* Avoid accepting generated code without understanding it.

AI accelerates development but does not replace engineering judgment.

---

# 18. Quality Gates

Before merging any change:

* Build passes.
* Type checking passes.
* Linting passes.
* Relevant tests pass.
* Documentation updated.
* No critical security issues introduced.

---

# 19. AI Coding Workflow

Recommended sequence:

1. Read relevant documentation.
2. Understand the existing implementation.
3. Plan the change.
4. Implement only the required files.
5. Run quality checks.
6. Update documentation.
7. Summarize the change.

Avoid unrelated refactoring unless explicitly requested.

---

# 20. Anti-Patterns

Avoid:

* Duplicate code.
* Circular dependencies.
* Large "god" components.
* Business logic in UI.
* Hardcoded secrets.
* Silent failures.
* Unused dependencies.

---

# 21. Continuous Improvement

Engineering standards should evolve.

When recurring issues are identified:

* Update documentation.
* Refine standards.
* Improve tooling.
* Share lessons learned.

---

# 22. AI Implementation Rules

Every AI coding agent must:

* Follow all previous architecture documents.
* Respect folder responsibilities.
* Reuse existing abstractions.
* Keep changes focused.
* Preserve backward compatibility.
* Explain significant design decisions in code reviews or implementation summaries.

---

# 23. Validation Checklist

Before completing a feature:

* Requirements satisfied.
* Workflow implemented.
* API contract respected.
* Security reviewed.
* Tests updated.
* Documentation updated.
* Build passes.
* Type checking passes.
* Linting passes.

---

# 24. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md
* 04_PROJECT_STRUCTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_BUSINESS_WORKFLOWS.md
* 07_API_SPECIFICATION.md
* 08_SECURITY_ARCHITECTURE.md
* 09_AI_ARCHITECTURE.md

Referenced by:

* All feature specifications
* Project Constitution
* Testing Strategy
