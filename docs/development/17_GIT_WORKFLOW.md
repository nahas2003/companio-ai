# 17_GIT_WORKFLOW.md

> **Project:** Companio
> **Document:** Git Workflow & Version Control Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines the Git workflow for the Companio project.

It establishes a consistent branching strategy, commit conventions, code review process, and release workflow to maintain a clean, traceable, and reliable repository history.

---

# 2. Objectives

After adopting this workflow:

* Development is organized and traceable.
* Parallel feature development is simplified.
* Releases become predictable.
* Rollbacks are easier.
* Collaboration between developers and AI coding agents remains consistent.

---

# 3. Branch Strategy

Maintain the following long-lived branches:

```text id="ghp7x2"
main
│
├── develop
│
├── feature/*
├── bugfix/*
├── hotfix/*
├── release/*
```

## Branch Purposes

### `main`

* Production-ready code only.
* Protected branch.
* Updated only through reviewed merges.

### `develop`

* Primary integration branch.
* Receives completed feature branches.
* Used for staging and pre-release validation.

### `feature/*`

Examples:

* `feature/authentication`
* `feature/question-bank`
* `feature/assessment-module`

One feature per branch.

### `bugfix/*`

For non-production bug fixes.

Example:

* `bugfix/question-filter`

### `hotfix/*`

For urgent production fixes.

Merge back into both `main` and `develop`.

### `release/*`

Used to stabilize an upcoming release.

Example:

* `release/v1.0.0`

---

# 4. Commit Message Convention

Use clear, descriptive commit messages.

Recommended format:

```text id="6xzjlwm"
<type>: <short description>
```

Examples:

* `feat: add assessment publishing`
* `fix: resolve timer synchronization issue`
* `docs: update deployment guide`
* `refactor: simplify question validation`
* `test: add scoring integration tests`
* `chore: update dependencies`

Common types:

* feat
* fix
* docs
* refactor
* test
* chore
* ci
* perf

---

# 5. Pull Request Workflow

Every pull request should include:

* Purpose of the change
* Related issue or task
* Summary of implementation
* Testing performed
* Screenshots (if UI changes)
* Known limitations (if any)

Keep pull requests focused on a single logical change.

---

# 6. Merge Strategy

Prefer:

* **Squash merge** for feature branches to keep history concise.
* **Merge commit** for release branches when preserving context is valuable.

Avoid unnecessary merge commits from frequently rebasing feature branches.

---

# 7. Branch Protection

Protect critical branches:

* Require pull requests.
* Require passing CI checks.
* Prevent force pushes.
* Require at least one review (or equivalent approval process).

---

# 8. Release Workflow

Typical release flow:

```text id="k1hm2v"
feature/*
      ↓
develop
      ↓
release/*
      ↓
main
      ↓
Production
```

Tag production releases using semantic versioning.

---

# 9. Versioning Strategy

Follow Semantic Versioning (SemVer):

```text id="ph0mru"
MAJOR.MINOR.PATCH
```

Examples:

* `1.0.0` – Initial stable release
* `1.1.0` – New backward-compatible feature
* `1.1.2` – Backward-compatible bug fix
* `2.0.0` – Breaking changes

---

# 10. Conflict Resolution

When resolving merge conflicts:

* Understand both changes before merging.
* Preserve intended functionality.
* Re-run tests after resolution.
* Avoid blindly accepting one side.

Document significant conflict resolutions if they affect architecture.

---

# 11. AI-Assisted Development Guidelines

When using AI coding agents:

* Create a dedicated feature branch.
* Keep prompts aligned with project documentation.
* Review AI-generated commits before merging.
* Avoid combining unrelated AI-generated changes in a single branch.
* Ensure generated code passes all quality checks.

---

# 12. Repository Maintenance

Regularly:

* Delete merged feature branches.
* Keep dependencies updated.
* Archive obsolete branches.
* Tag stable releases.

Maintain a clean repository history.

---

# 13. Code Review Checklist

Review:

* Architecture compliance
* Coding standards
* Security considerations
* Performance implications
* Test coverage
* Documentation updates
* Backward compatibility

Focus reviews on correctness and maintainability.

---

# 14. Continuous Integration

Every branch should automatically run:

* Dependency installation
* Linting
* Type checking
* Unit tests
* Integration tests
* Build verification

Branches failing required checks should not be merged.

---

# 15. Recovery Strategy

Be prepared to recover from:

* Accidental merges
* Failed releases
* Broken builds
* Incorrect commits

Use revert operations rather than rewriting shared history whenever practical.

---

# 16. Common Mistakes

Avoid:

* Committing directly to `main`.
* Mixing unrelated changes in one commit.
* Large, unreviewable pull requests.
* Force-pushing shared branches.
* Leaving stale branches indefinitely.

---

# 17. Acceptance Criteria

The Git workflow is complete when:

* Branches follow the defined strategy.
* Commit messages are consistent.
* Pull requests include required information.
* CI checks are enforced.
* Releases are versioned correctly.

---

# 18. Definition of Done

The Git workflow is established when:

* Contributors consistently follow it.
* Repository history remains clean.
* Releases are repeatable.
* AI-assisted development integrates smoothly with human review.

---

# 19. Next Development Module

Proceed to:

**18_ENVIRONMENT_CONFIGURATION.md**
