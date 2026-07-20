# 08_QUESTION_BANK.md

> **Project:** Companio
> **Document:** Question Bank Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Question Bank module.

The Question Bank is the central repository for all AI-generated and manually created questions. It provides a reusable, searchable, versioned, and editable collection of assessment content that can be used across Practice Mode, Assessment Templates, and future learning experiences.

This module manages questions—it does not generate them.

---

# 2. Objectives

After completing this module:

- Question Banks can be created and managed.
- AI-generated questions can be imported.
- Manual questions can be added.
- Questions can be edited and reviewed.
- Versions are maintained.
- Search and filtering are supported.
- Question Banks can be reused across multiple assessments.

---

# 3. Prerequisites

Complete before starting:

- 00_MASTER_DEVELOPMENT_PLAN.md
- 01_PROJECT_SETUP.md
- 02_DATABASE_SETUP.md
- 03_AUTHENTICATION.md
- 04_AI_ORCHESTRATOR.md
- 05_SOURCE_MANAGEMENT.md
- 06_CONTENT_INGESTION.md
- 07_AI_CONTENT_PROCESSING.md

Review architecture:

- 15_QUESTION_BANK.md
- 12_ASSESSMENT_MODE.md
- 11_PRACTICE_MODE.md
- 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement a reusable Question Bank management system that stores, organizes, searches, edits, and versions questions independently of AI generation.

## Expected Output

A complete Question Bank module with:

- CRUD operations
- Version management
- Question review
- Search
- Filtering
- Import from AI workflows
- Manual question creation
- Question reuse

## Files Allowed to Modify

- `src/features/question-bank/`
- `src/services/question-bank/`
- Shared schemas
- Shared validation utilities

## Files That Must NOT Be Modified

- AI Orchestrator
- AI Content Processing
- Assessment Engine
- Results
- Leaderboard

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── question-bank/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── api/
│       ├── schemas/
│       ├── validators/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

---

# 6. Question Bank Lifecycle

Every Question Bank follows this lifecycle:

```text
Created
    ↓
Draft
    ↓
Under Review
    ↓
Approved
    ↓
Published
    ↓
Archived
```

Questions should only be used in published assessments when they are in an appropriate review state.

---

# 7. Supported Question Types

Support at least:

- Multiple Choice (Single Answer)
- Multiple Choice (Multiple Answers)
- True / False
- Fill in the Blank
- Short Answer (future-ready)
- Descriptive (future-ready)

Design the model so additional question types can be added without modifying existing logic.

---

# 8. Frontend Tasks

Implement:

- Question Bank list
- Create Question Bank page
- Question Bank details
- Question editor
- Manual question creation
- AI import interface
- Search
- Filters
- Pagination
- Bulk actions
- Review status indicators
- Empty, loading, and error states

The UI should support efficient management of large collections.

---

# 9. Backend Tasks

Implement services for:

- Create Question Bank
- Retrieve Question Bank
- Update Question Bank
- Delete or Archive Question Bank
- Add Question
- Update Question
- Remove Question
- Import AI-generated questions
- Version Question Bank
- Search and filter questions

All operations must enforce ownership and permissions.

---

# 10. Database Tasks

Create or verify support for:

- Question Bank entity
- Question entity
- Question versions
- Tags
- Difficulty levels
- Review status
- Metadata

Ensure relationships support reuse across multiple assessments.

---

# 11. Validation Rules

Validate:

- Question text
- Answer options
- Correct answer(s)
- Difficulty value
- Question type
- Duplicate questions
- Required metadata

Reject incomplete or inconsistent questions.

---

# 12. State Management

Manage:

- Question Bank list
- Selected Question Bank
- Question collection
- Filters
- Search query
- Pagination
- Editing state
- Validation errors

Keep state synchronized with backend changes.

---

# 13. API Integration

Implement operations for:

- CRUD Question Banks
- CRUD Questions
- Import AI output
- Versioning
- Search
- Filtering

API contracts should remain stable for future web and mobile clients.

---

# 14. Security Requirements

Ensure:

- Only authorized users can modify Question Banks.
- Read permissions follow ownership or sharing rules.
- Input is validated and sanitized.
- Archived Question Banks cannot be modified without restoration.

Never rely solely on client-side authorization.

---

# 15. User Experience

The interface should provide:

- Fast navigation
- Efficient editing
- Bulk selection
- Search as you type (where appropriate)
- Clear review status
- Undo opportunities for non-destructive actions when feasible

---

# 16. Testing Checklist

Verify:

- Question Bank creation works.
- Manual question creation works.
- AI import succeeds.
- Editing updates correctly.
- Search returns expected results.
- Filters behave correctly.
- Version history is maintained.
- Unauthorized access is blocked.

---

# 17. Acceptance Criteria

The module is complete when:

- Question Banks can be fully managed.
- AI-generated questions can be imported.
- Manual questions can be created and edited.
- Versioning works.
- Search and filtering perform correctly.
- Tests pass.

---

# 18. Common Mistakes

Avoid:

- Regenerating AI content inside this module.
- Mixing Question Bank logic with Assessment logic.
- Allowing edits to immutable published versions.
- Storing provider-specific AI data with questions.
- Skipping validation of imported questions.

---

# 19. Definition of Done

The Question Bank module is complete when:

- It acts as the single source of truth for reusable questions.
- It supports review and versioning.
- It integrates cleanly with Practice Mode and Assessment Templates.
- It follows project architecture and standards.

---

# 20. Next Development Module

Proceed to:

**09_PRACTICE_MODE.md**
