# ARCHITECTURAL_DECISIONS.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document records the significant architectural decisions made during the design and implementation of Companio.

Each decision includes:

* Context
* Problem
* Decision
* Rationale
* Trade-offs
* Consequences
* Review status

This document should be updated whenever a major architectural decision is made or revised.

---

# 2. Decision Record Template

Each Architectural Decision Record (ADR) should use the following format:

## ADR-XXX: Decision Title

**Status**

* Proposed
* Accepted
* Superseded
* Deprecated

**Date**

YYYY-MM-DD

**Context**

Describe the problem or requirement.

**Decision**

State the chosen solution.

**Rationale**

Explain why this option was selected.

**Alternatives Considered**

List other options evaluated.

**Consequences**

Describe the expected benefits, limitations, and future implications.

---

# 3. ADR-001 — Modular Architecture

**Status**

Accepted

**Context**

The platform includes authentication, AI, assessments, analytics, notifications, administration, and future expansion.

**Decision**

Organize the application into modular, feature-oriented domains with clear responsibilities.

**Rationale**

* Easier maintenance
* Independent feature development
* Better testing
* Clear ownership
* Scalable architecture

**Alternatives Considered**

* Layer-based architecture
* Monolithic module organization

**Consequences**

* Slightly more initial structure
* Better long-term maintainability

---

# 4. ADR-002 — Supabase as Backend Platform

**Status**

Accepted

**Context**

The project requires authentication, a relational database, file storage, and real-time capabilities.

**Decision**

Use Supabase as the primary backend platform.

**Rationale**

* PostgreSQL foundation
* Built-in authentication
* Storage support
* Row Level Security (RLS)
* Developer productivity

**Alternatives Considered**

* Firebase
* Custom backend
* Appwrite

**Consequences**

* Faster MVP delivery
* Dependency on Supabase services
* PostgreSQL compatibility retained

---

# 5. ADR-003 — AI Orchestrator Pattern

**Status**

Accepted

**Context**

The application must support multiple AI providers and evolve over time.

**Decision**

Route all AI interactions through a centralized AI Orchestrator.

**Rationale**

* Provider abstraction
* Centralized prompt handling
* Retry policies
* Logging
* Validation
* Easier provider switching

**Alternatives Considered**

* Direct provider calls from feature modules

**Consequences**

* Slightly more abstraction
* Much greater flexibility and maintainability

---

# 6. ADR-004 — Centralized Question Bank

**Status**

Accepted

**Context**

Questions are generated, reviewed, reused, and referenced by multiple features.

**Decision**

Maintain a single Question Bank as the authoritative repository.

**Rationale**

* Reuse across practice and assessments
* Easier search and categorization
* Consistent question quality

**Alternatives Considered**

* Store questions within individual assessments
* Generate questions on demand only

**Consequences**

* Requires additional management features
* Improves long-term content reuse

---

# 7. ADR-005 — Separation of Practice and Assessment

**Status**

Accepted

**Context**

Learning workflows differ significantly from formal evaluations.

**Decision**

Implement Practice Mode and Assessment Mode as separate modules.

**Rationale**

Practice:

* Immediate feedback
* Flexible pacing
* Learning-focused

Assessment:

* Controlled timing
* Submission workflow
* Formal evaluation

**Alternatives Considered**

* Single combined workflow

**Consequences**

* Additional implementation effort
* Clearer user experience and business logic

---

# 8. ADR-006 — Event-Driven Notifications

**Status**

Accepted

**Context**

Many modules need to notify users without becoming tightly coupled.

**Decision**

Adopt an event-driven notification model.

**Rationale**

Business modules publish events, and the notification system consumes them.

**Alternatives Considered**

* Direct notification calls from each module

**Consequences**

* Better modularity
* Easier addition of new notification channels

---

# 9. ADR-007 — API Versioning

**Status**

Accepted

**Context**

Public APIs evolve over time.

**Decision**

Use versioned API endpoints.

Example:

```text id="v8w0qg"
/api/v1/
```

**Rationale**

* Supports backward compatibility
* Simplifies future changes
* Predictable API lifecycle

---

# 10. ADR-008 — UUID Primary Keys

**Status**

Accepted

**Context**

Records should remain globally unique and difficult to enumerate.

**Decision**

Use UUIDs for primary keys where appropriate.

**Rationale**

* Better uniqueness
* Easier distributed systems support
* Reduced predictability

**Alternatives Considered**

* Auto-incrementing integers

---

# 11. ADR-009 — Soft Delete Strategy

**Status**

Accepted

**Context**

Business data may need to be restored or audited.

**Decision**

Prefer soft deletes using a `deleted_at` field for business entities.

**Rationale**

* Supports recovery
* Preserves audit history
* Reduces accidental data loss

**Alternatives Considered**

* Permanent deletion

---

# 12. ADR-010 — Documentation-Driven Development

**Status**

Accepted

**Context**

The project relies heavily on AI-assisted development.

**Decision**

Maintain architecture, task, knowledge, and operations documentation as first-class project artifacts.

**Rationale**

* Improves AI context
* Reduces implementation ambiguity
* Simplifies onboarding
* Encourages consistent development

**Alternatives Considered**

* Minimal documentation
* Code-only guidance

---

# 13. Decision Review Process

When proposing a new architectural decision:

1. Define the problem.
2. Evaluate multiple alternatives.
3. Document trade-offs.
4. Record the selected approach.
5. Obtain review or approval if required.
6. Update related documentation.

---

# 14. Superseding Decisions

If a decision is replaced:

* Keep the original ADR.
* Mark its status as **Superseded**.
* Add a reference to the replacement ADR.
* Explain why the change occurred.

Do not delete historical decision records.

---

# 15. AI Agent Guidelines

Before making an architectural change, the AI agent should:

1. Review existing ADRs.
2. Respect accepted architectural decisions.
3. Avoid introducing conflicting patterns.
4. Document any new architectural decisions.
5. Update affected documentation.

---

# 16. Maintenance

Update this document whenever:

* A significant architectural decision is made.
* An accepted decision is revised or superseded.
* New technologies or patterns materially affect the system architecture.
