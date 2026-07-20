# IMPLEMENTATION_MASTER_GUIDE.md

> **Project:** Companio
>
> **Purpose:** Master implementation guide for AI agents and developers
>
> **Version:** 1.0
>
> **Status:** Authoritative Development Guide

---

# 1. Purpose

This document is the **single entry point** for anyone implementing the Companio platform.

Before writing or modifying any production code, every developer or AI coding agent **must read this guide** and follow the implementation workflow described here.

This document defines:

- How the project should be understood.
- The order in which documentation should be read.
- Development rules.
- Coding workflow.
- Task execution process.
- Testing expectations.
- Documentation responsibilities.
- Definition of Done.

This guide is the authoritative reference for implementation.

---

# 2. Project Philosophy

Companio is built using a **documentation-first development approach**.

The architecture, database, APIs, UI, modules, AI workflows, and operational procedures have already been designed before implementation begins.

Development should focus on implementing the documented design rather than redesigning the platform during coding.

If implementation reveals a genuine issue with the documentation:

- Record the issue.
- Discuss the change.
- Update documentation before changing architecture.
- Keep implementation and documentation synchronized.

---

# 3. Development Principles

Always follow these principles:

- Build incrementally.
- Keep modules loosely coupled.
- Write maintainable code.
- Prefer readability over cleverness.
- Avoid premature optimization.
- Keep business logic separate from UI.
- Minimize duplication.
- Write reusable components.
- Validate inputs.
- Handle errors gracefully.
- Keep code production-ready.

---

# 4. Technology Stack

Use the approved technology stack documented in the project architecture.

Examples include:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- AI Orchestrator Layer
- Server Actions / API Routes (as documented)
- Appropriate testing framework

Do not replace core technologies without updating the architecture documentation.

---

# 5. Repository Structure

The repository should follow the documented project structure.

Key directories include:

```text
docs/
app/
components/
lib/
hooks/
services/
database/
supabase/
public/
styles/
tests/
scripts/
```

Documentation should remain inside the `docs` directory.

---

# 6. Documentation Reading Order

Before beginning implementation, read the following documents in order:

1. Project Overview
2. Architecture Documentation
3. Database Architecture
4. API Reference
5. UI Design Guidelines
6. Relevant Module Specification
7. Relevant Task Document

Do not skip directly to implementation without understanding the applicable documentation.

---

# 7. Implementation Workflow

Development should proceed sequentially through the task documents.

Workflow:

```text
Read Task

↓

Understand Scope

↓

Implement

↓

Test

↓

Fix Issues

↓

Verify Against Specification

↓

Mark Task Complete

↓

Commit Changes

↓

Proceed to Next Task
```

Tasks should not be skipped unless explicitly approved.

---

# 8. Task Execution Rules

For every task:

- Read the task document completely.
- Identify dependencies.
- Review related specifications.
- Implement only the defined scope.
- Avoid introducing unrelated features.
- Ensure compatibility with previous tasks.

Do not implement future tasks prematurely.

---

# 9. Coding Standards

Code should be:

- Consistent.
- Modular.
- Typed where applicable.
- Self-explanatory.
- Properly formatted.
- Well documented where necessary.

Avoid:

- Dead code.
- Large functions.
- Deep nesting.
- Hardcoded values.
- Duplicate logic.

---

# 10. UI Development Rules

UI implementation must follow:

- UI Design Guidelines
- Component Library
- Accessibility guidance
- Responsive design requirements

Prefer reusable components over page-specific implementations.

---

# 11. Database Rules

Database changes must:

- Follow the documented schema.
- Use approved migrations.
- Preserve data integrity.
- Maintain foreign key relationships.
- Respect audit fields.
- Avoid manual production schema changes.

---

# 12. API Rules

APIs must:

- Follow documented contracts.
- Return consistent response formats.
- Validate inputs.
- Handle errors consistently.
- Enforce authentication and authorization.

Avoid undocumented API behavior.

---

# 13. AI Implementation Rules

All AI functionality should:

- Route through the AI orchestration layer.
- Use approved prompt templates.
- Validate AI responses.
- Handle provider failures gracefully.
- Log AI operations where appropriate.

Provider-specific logic should remain isolated.

---

# 14. Testing Requirements

Every completed task should be verified through appropriate testing.

Testing should include:

- Functional validation.
- Error handling.
- Edge cases.
- UI behavior.
- API validation.
- Integration verification.

Do not mark a task complete without testing.

---

# 15. Documentation Responsibilities

If implementation changes documented behavior:

1. Update the relevant documentation.
2. Record architectural changes.
3. Update API documentation if required.
4. Update database documentation if required.
5. Maintain consistency across documents.

Documentation should always reflect the implemented system.

---

# 16. Definition of Done

A task is complete only when:

- Scope fully implemented.
- Code reviewed.
- Tests pass.
- Documentation updated (if required).
- No critical defects remain.
- Build succeeds.
- Acceptance criteria satisfied.

---

# 17. Git Workflow

For each completed task:

1. Implement changes.
2. Verify functionality.
3. Review modified files.
4. Commit with a descriptive message.
5. Push changes (if applicable).

Example commit messages:

- `feat(auth): implement user authentication`
- `feat(ai): add question generation service`
- `fix(api): handle invalid request payload`
- `refactor(ui): extract reusable form components`

---

# 18. AI Agent Instructions

Every AI coding agent working on this repository must:

- Read this guide before implementation.
- Read only the documentation relevant to the current task.
- Avoid unnecessary architectural changes.
- Preserve existing code quality.
- Explain significant implementation decisions.
- Prefer maintainability over shortcuts.
- Keep commits focused on a single task.
- Stop and request clarification if documentation conflicts are discovered.

---

# 19. Development Sequence

Implementation order:

1. Project setup
2. Core infrastructure
3. Authentication
4. Database integration
5. Shared components
6. Feature modules
7. AI integration
8. Testing
9. Performance optimization
10. Production readiness

The detailed execution order is defined in the task documents.

---

# 20. Completion Workflow

Continue implementing tasks until all planned implementation documents have been completed.

After the final implementation task:

- Execute the complete testing strategy.
- Perform security review.
- Validate production readiness.
- Complete deployment checklist.
- Prepare release documentation.
- Deploy according to the Deployment Runbook.

---

# 21. Guiding Principle

> **Documentation defines the system.**
>
> **Implementation realizes the documentation.**
>
> Build deliberately, test thoroughly, document continuously, and ship only when the implementation matches the documented design.

This document should be treated as the authoritative implementation guide for the Companio platform.
