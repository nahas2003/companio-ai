# DATABASE_DICTIONARY.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines every database entity used in Companio.

It serves as the single source of truth for database structure, naming conventions, relationships, ownership, and intended usage.

Developers and AI coding agents should consult this document before introducing new tables or modifying existing ones.

---

# 2. Design Principles

The database should follow these principles:

* Normalize data where appropriate.
* Preserve referential integrity.
* Use soft deletes unless permanent deletion is explicitly required.
* Include audit fields on business tables.
* Prefer UUID primary keys.
* Keep naming consistent and descriptive.

---

# 3. Naming Conventions

## Tables

Use:

```
snake_case
```

Examples:

* users
* user_profiles
* learning_sources
* practice_sessions
* assessment_attempts

---

## Columns

Examples:

* created_at
* updated_at
* deleted_at
* created_by
* updated_by

---

## Foreign Keys

Convention:

```
<table_name>_id
```

Examples:

* user_id
* assessment_id
* source_id

---

# 4. Common Audit Fields

Business tables should include:

* id
* created_at
* updated_at
* deleted_at (optional)
* created_by (where applicable)
* updated_by (where applicable)

---

# 5. Core Entities

## Identity

### users

Purpose:

Authentication identity.

Owns:

* user_profiles
* notifications
* practice_sessions
* assessment_attempts

---

### user_profiles

Purpose:

Stores profile information.

Contains:

* display name
* avatar
* preferences
* timezone
* language

---

## Learning Materials

### learning_sources

Purpose:

Uploaded study materials.

Contains:

* file metadata
* storage path
* processing state
* ownership

---

### processed_documents

Purpose:

Structured content extracted from uploaded materials.

Contains:

* normalized text
* metadata
* processing status

---

## AI

### ai_requests

Purpose:

Tracks every AI request.

Contains:

* provider
* model
* prompt version
* request timestamp
* status

---

### ai_prompt_templates

Purpose:

Stores reusable prompt templates.

Contains:

* template name
* version
* variables
* active status

---

## Questions

### questions

Purpose:

Central Question Bank.

Contains:

* question text
* type
* difficulty
* explanation
* source reference

---

### question_options

Purpose:

Stores answer choices for objective questions.

---

### question_tags

Purpose:

Supports flexible categorization.

---

## Practice

### practice_sessions

Purpose:

Tracks learner practice sessions.

---

### practice_answers

Purpose:

Stores learner responses during practice.

---

## Assessments

### assessments

Purpose:

Assessment definitions.

---

### assessment_questions

Purpose:

Maps questions to assessments.

---

### assessment_attempts

Purpose:

Tracks learner attempts.

---

### assessment_answers

Purpose:

Stores learner assessment responses.

---

## Results

### assessment_results

Purpose:

Stores final evaluation outcomes.

Contains:

* score
* percentage
* pass/fail
* grading metadata

---

## Notifications

### notifications

Purpose:

Stores user notifications.

---

### notification_preferences

Purpose:

Stores delivery preferences.

---

## Administration

### system_settings

Purpose:

Application-wide configuration.

---

### feature_flags

Purpose:

Feature toggles.

---

### audit_logs

Purpose:

Tracks administrative and security-sensitive actions.

---

# 6. Relationship Overview

```
User
│
├── Profile
├── Learning Sources
│      │
│      └── Processed Documents
│                │
│                └── Questions
│                        │
│                        ├── Practice
│                        └── Assessments
│                                 │
│                                 └── Results
│
└── Notifications
```

---

# 7. Data Ownership

Each business record must clearly define:

* Owner
* Creator
* Last modifier
* Visibility rules
* Deletion policy

---

# 8. Indexing Guidelines

Create indexes for:

* Foreign keys
* Frequently filtered columns
* Searchable fields
* Status fields
* Date fields

Avoid unnecessary indexes on low-selectivity columns.

---

# 9. Soft Delete Policy

Prefer:

```
deleted_at
```

instead of permanent deletion for business data.

Permanent deletion should be limited to maintenance operations and comply with any applicable retention requirements.

---

# 10. Data Integrity Rules

Maintain:

* Foreign key constraints
* Required fields
* Validation rules
* Transactional consistency
* Optimistic concurrency where appropriate

---

# 11. Migration Guidelines

Every migration should:

* Be reversible where practical.
* Include validation.
* Preserve existing data.
* Avoid destructive changes without explicit approval.
* Be tested before production deployment.

---

# 12. AI Agent Guidelines

Before creating or modifying database structures, the AI agent should:

1. Check whether a suitable table already exists.
2. Reuse existing relationships where appropriate.
3. Follow naming conventions.
4. Preserve backward compatibility whenever possible.
5. Document schema changes.
6. Update this dictionary when introducing new entities.

---

# 13. Maintenance

This document must be updated whenever:

* A new table is added.
* A table is removed.
* Relationships change.
* Naming conventions evolve.
* Database architecture is modified.
