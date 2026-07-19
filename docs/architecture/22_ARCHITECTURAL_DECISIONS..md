# 22_ARCHITECTURAL_DECISIONS.md

> **Project:** Companio
> **Document:** Architectural Decision Records (ADR)
> **Version:** 1.0
> **Priority:** High
> **Depends On:** 00–21

---

# 1. Purpose

This document records the significant architectural decisions made during the design of Companio.

Each decision explains:

* The problem.
* The chosen solution.
* Alternatives considered.
* Consequences.

Architectural decisions should not be changed without updating this document.

---

# ADR-001

## Title

Separate Sources from Question Banks.

### Status

Accepted

### Context

Questions may be generated from PDFs, notes, or topics.

Multiple assessments may reuse the same generated questions.

### Decision

Introduce a reusable **Source** entity and a separate **Question Bank** entity.

### Alternatives Considered

Generate questions directly into assessments.

### Consequences

* Better reuse.
* Lower AI costs.
* Cleaner architecture.

### Related Documents

* 05_DATABASE_ARCHITECTURE.md
* 13_AI_CONTENT_PROCESSING.md
* 15_QUESTION_BANK.md

---

# ADR-002

## Title

Version Question Banks.

### Status

Accepted

### Context

Prompt templates and AI models evolve over time.

### Decision

Every Question Bank supports immutable versions.

### Alternatives Considered

Overwrite existing generated questions.

### Consequences

* Reproducibility.
* Auditability.
* Safe regeneration.

---

# ADR-003

## Title

Separate Assessment Templates from Published Assessments.

### Status

Accepted

### Context

Published assessments must remain stable even if templates change.

### Decision

Publish immutable snapshots.

### Alternatives Considered

Allow editing published assessments.

### Consequences

* Stable participant experience.
* Reliable analytics.
* Better audit trail.

---

# ADR-004

## Title

Use an AI Orchestrator.

### Status

Accepted

### Context

Multiple AI providers may be used over time.

### Decision

Business logic communicates only with the AI Orchestrator.

### Alternatives Considered

Direct provider integrations throughout the codebase.

### Consequences

* Provider independence.
* Easier maintenance.
* Centralized retries and validation.

---

# ADR-005

## Title

Results are the Source of Truth.

### Status

Accepted

### Context

Leaderboards, dashboards, and reports all rely on assessment outcomes.

### Decision

Store immutable Results and derive downstream views from them.

### Alternatives Considered

Compute rankings and analytics directly from Attempts.

### Consequences

* Consistent reporting.
* Simpler analytics.
* Clear separation of concerns.

---

# ADR-006

## Title

Separate Identity, Authentication, and Authorization.

### Status

Accepted

### Context

Guest users, creators, and administrators require different capabilities.

### Decision

Treat identity, authentication, and authorization as independent concepts.

### Alternatives Considered

Role-based authentication only.

### Consequences

* Greater flexibility.
* Easier future expansion.
* Cleaner security model.

---

# ADR-007

## Title

Treat AI Processing and Content Ingestion as Separate Pipelines.

### Status

Accepted

### Context

Content ingestion and AI generation have different responsibilities.

### Decision

Create independent ingestion and AI processing layers.

### Alternatives Considered

Single monolithic AI pipeline.

### Consequences

* Better separation of concerns.
* Easier testing.
* Easier future content integrations.

---

# ADR-008

## Title

Architectural Contracts Must Be Tested.

### Status

Accepted

### Context

Certain system invariants must never be broken.

### Decision

Test architectural rules in addition to functional behavior.

### Alternatives Considered

Feature-only testing.

### Consequences

* Improved long-term reliability.
* Better regression protection.
* Higher confidence in refactoring.

---

# Decision Lifecycle

Every new architectural decision should include:

* Decision ID
* Status
* Context
* Decision
* Alternatives
* Consequences
* Related Documents

Existing ADRs should never be deleted.

If a decision changes, mark the previous ADR as **Superseded** and create a new one referencing it.

---

# Governance

Architectural changes require:

* Updated ADR.
* Documentation updates.
* Impact assessment.
* Review before implementation.

---

# Acceptance Criteria

The ADR log is complete when:

* Major architectural decisions are documented.
* Rationale is recorded.
* Alternatives are preserved.
* Future contributors can understand the reasoning behind the architecture.

---

# Document Relationships

## Depends On

* 00–21

## Used By

* Future architectural reviews.
* Major feature proposals.
* Refactoring efforts.

## Related Documents

* 02_SYSTEM_ARCHITECTURE.md
* 21_PROJECT_CONSTITUTION.md
* All feature specifications.
