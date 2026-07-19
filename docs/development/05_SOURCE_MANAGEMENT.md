# 05_SOURCE_MANAGEMENT.md

> **Project:** Companio
> **Document:** Source Management Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Source Management module.

A **Source** is the canonical representation of learning content within Companio. Every downstream process—content ingestion, AI processing, Question Bank generation, practice sessions, and assessments—starts from a Source.

The goal is to manage learning materials independently of AI processing.

---

# 2. Objectives

After completing this module:

* Users can create Sources.
* Users can edit Source metadata.
* Users can archive Sources.
* Users can organize Sources.
* Sources are securely stored.
* Sources are ready for Content Ingestion.

---

# 3. Prerequisites

Complete before starting:

* 00_MASTER_DEVELOPMENT_PLAN.md
* 01_PROJECT_SETUP.md
* 02_DATABASE_SETUP.md
* 03_AUTHENTICATION.md
* 04_AI_ORCHESTRATOR.md

Review architecture:

* 02_SYSTEM_ARCHITECTURE.md
* 14_CONTENT_INGESTION.md
* 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Build the Source Management module responsible for creating and managing learning material records.

## Expected Output

A fully functional Source Management feature that supports CRUD operations, metadata management, ownership, and integration with future ingestion workflows.

## Files Allowed to Modify

* `src/features/source/`
* `src/services/source/`
* Source-related routes
* Shared UI components (only if reusable)

## Files That Must NOT Be Modified

* AI Content Processing
* Question Bank
* Assessment Engine
* Results
* Leaderboard

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── source/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── api/
│       ├── schemas/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

---

# 6. Source Lifecycle

Every Source follows this lifecycle:

```text
Draft
    ↓
Saved
    ↓
Ready for Ingestion
    ↓
Processed
    ↓
Archived
```

Only Sources in appropriate states may move to later stages.

---

# 7. Supported Source Types

Support at least:

* PDF Document
* Plain Text Notes
* Topic Name
* Rich Text (future-ready)
* External URL (future-ready)

Design the model so additional source types can be added without changing business logic.

---

# 8. Frontend Tasks

Implement:

* Source list page
* Source details page
* Create Source form
* Edit Source form
* Archive confirmation
* Search input
* Filter controls
* Pagination (if required)
* Empty state
* Loading state
* Error state

Requirements:

* Responsive layout
* Accessible forms
* Clear validation messages

---

# 9. Backend Tasks

Implement services for:

* Create Source
* Retrieve Source
* Update Source
* Archive Source
* List Sources
* Search Sources

All operations must respect ownership and permissions.

---

# 10. Database Tasks

Create or verify support for:

* Source entity
* Ownership relationship
* Metadata fields
* Status field
* Timestamps

Ensure indexes support efficient searching and listing.

---

# 11. Validation Rules

Validate:

* Required title
* Valid source type
* Ownership
* Maximum input size (where applicable)
* Duplicate detection (basic metadata level)

Reject invalid requests before persistence.

---

# 12. State Management

Manage:

* Source list
* Selected Source
* Loading state
* Pagination state
* Search query
* Filters
* Error state

Use a consistent data-fetching strategy across the application.

---

# 13. API Integration

Implement operations for:

* Create
* Read
* Update
* Archive
* List
* Search

Keep API contracts stable for future mobile clients.

---

# 14. Security Requirements

Ensure:

* Only owners can modify private Sources.
* Archived Sources cannot be edited without restoration (if supported).
* Input is sanitized.
* Authorization is enforced server-side.

Never rely solely on client-side checks.

---

# 15. User Experience

The interface should provide:

* Fast creation flow
* Clear status indicators
* Easy navigation
* Confirmation before destructive actions
* Helpful empty states

---

# 16. Testing Checklist

Verify:

* Source creation works.
* Metadata updates succeed.
* Search returns expected results.
* Archive behaves correctly.
* Unauthorized access is blocked.
* Validation errors are displayed properly.
* Large lists remain responsive.

---

# 17. Acceptance Criteria

The module is complete when:

* CRUD operations work.
* Ownership is enforced.
* Search functions correctly.
* Source lifecycle is respected.
* Tests pass.
* Documentation is updated.

---

# 18. Common Mistakes

Avoid:

* Mixing Source Management with AI processing.
* Storing provider-specific AI data in the Source.
* Allowing unauthorized updates.
* Coupling UI directly to database models.

---

# 19. Definition of Done

The Source Management module is complete when:

* Users can manage learning materials.
* Sources are independent of AI processing.
* The module integrates cleanly with Content Ingestion.
* Code follows project architecture and standards.

---

# 20. Next Development Module

Proceed to:

**06_CONTENT_INGESTION.md**
