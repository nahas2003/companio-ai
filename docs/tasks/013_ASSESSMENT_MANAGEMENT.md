# 013_ASSESSMENT_MANAGEMENT.md

> **Project:** Companio
> **Task ID:** 013
> **Task Name:** Assessment Management
> **Priority:** Critical
> **Estimated Complexity:** High

---

# 1. Purpose

Implement the Assessment Management module.

This module enables administrators and educators to create, configure, and manage assessments using questions from the Question Bank.

It defines **what an assessment is**, but it does **not** deliver the assessment to learners.

---

# 2. Business Goal

Provide a flexible assessment creation system that allows administrators to build structured evaluations from existing questions.

---

# 3. User Story

**As an administrator, I want to create and configure assessments from the Question Bank so that learners can take structured evaluations.**

---

# 4. Objective

At the end of this task:

- Assessments can be created.
- Questions can be selected manually or randomly.
- Assessment settings can be configured.
- Assessments can be saved as drafts or published.
- Assessments can be edited before publication.

---

# 5. MVP Implementation

Implement:

### Assessment Creation

- Create assessment
- Edit assessment
- Duplicate assessment
- Archive assessment
- Delete assessment (soft delete)

### Question Selection

Support:

- Manual selection
- Random selection
- Filter by subject
- Filter by topic
- Filter by difficulty
- Filter by question type

### Assessment Configuration

Allow configuration of:

- Assessment title
- Description
- Instructions
- Time limit
- Total questions
- Passing score
- Shuffle questions
- Shuffle options
- Maximum attempts
- Availability window (optional)

### Publishing

Support:

- Draft
- Published
- Archived

---

# 6. Future Enhancements

Future versions may include:

- Question pools
- Section-based assessments
- Adaptive assessments
- Negative marking
- Partial credit
- AI-generated assessments
- Scheduled releases
- Password-protected assessments
- Assessment templates

---

# 7. Out of Scope

Do **not** implement:

- Assessment player
- Answer submission
- Grading
- Results
- Certificates
- Analytics

This task ends once assessments are configured and ready for delivery.

---

# 8. Required Reading

## Architecture

- Assessment specification
- Question Bank specification
- Master Project Specification
- Database Architecture

## Development

- Coding Standards
- Security Checklist
- Error Handling
- AI Agent Workflow

---

# 9. Prerequisites

Complete:

- Tasks 001–012

Verify:

- Question Bank is operational.
- Questions are searchable and filterable.

---

# 10. Integration Points

### Input

- Questions from the Question Bank
- Assessment settings

### Output

- Assessment definition
- Assessment configuration
- Published assessment metadata

Future Assessment Delivery consumes these outputs.

---

# 11. Files Allowed to Modify

The AI may modify:

- Assessment management pages
- Assessment services
- Assessment configuration components
- Selection utilities
- CRUD APIs
- Validation services

---

# 12. Files Not to Modify

Do **not** implement:

- Assessment player
- Submission logic
- Results
- Analytics
- Certificates

Only implement assessment management.

---

# 13. Database Changes

Implement support for:

- Assessment records
- Assessment metadata
- Question mappings
- Assessment status
- Configuration settings
- Draft and publish states

Create indexes where appropriate for efficient retrieval.

---

# 14. Frontend Tasks

Implement:

- Assessment list
- Assessment creation form
- Question selector
- Filter panel
- Configuration page
- Publish workflow
- Draft management
- Empty states
- Loading states

---

# 15. Backend Tasks

Implement:

- CRUD operations
- Question assignment
- Random selection logic
- Validation
- Draft handling
- Publish workflow
- Soft delete
- Archive support

---

# 16. AI Implementation Rules

The AI must:

- Use only questions from the Question Bank.
- Never duplicate question content unnecessarily.
- Separate assessment configuration from delivery.
- Validate all assessment settings before publishing.
- Preserve assessment integrity after publication unless edits are explicitly allowed.

---

# 17. Implementation Checklist

- Assessment CRUD implemented
- Question selection completed
- Random selection implemented
- Configuration supported
- Draft workflow implemented
- Publish workflow completed
- Archive supported

---

# 18. Testing Checklist

Verify:

- Assessments can be created.
- Questions are assigned correctly.
- Random selection works.
- Validation prevents invalid configurations.
- Drafts save correctly.
- Published assessments appear correctly.
- Archive and restore function properly.

---

# 19. Acceptance Criteria

Task is complete when:

- Administrators can create assessments.
- Assessment settings are configurable.
- Questions are linked successfully.
- Publishing works correctly.
- Assessments are ready for delivery.

---

# 20. Definition of Done

Assessment Management is complete when:

- CRUD operations are stable.
- Question assignment is reliable.
- Draft and publish workflows function correctly.
- Configuration validation passes.
- Tests pass.

---

# 21. Deliverables

Expected outputs:

- Assessment management module
- Assessment configuration UI
- Question selection tools
- Publish workflow
- CRUD APIs
- Supporting tests

---

# 22. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the Assessment Management module.

Do not implement the assessment player, answer submission, grading, results, certificates, or analytics.

Use questions exclusively from the Question Bank and ensure all assessment configurations are validated before publication.

Follow the project's coding standards, security checklist, and AI workflow.

Run all applicable validation and tests.

Provide a summary of changes, modified files, and testing results.

---

# 23. Next Task

Proceed to:

**014_ASSESSMENT_DELIVERY.md**
