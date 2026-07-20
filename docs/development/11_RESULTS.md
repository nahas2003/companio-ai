# 11_RESULTS.md

> **Project:** Companio
> **Document:** Results Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Results module.

The Results module processes completed assessment attempts, calculates scores, generates performance summaries, and provides meaningful insights to participants and administrators.

This module does not conduct assessments or manage rankings.

---

# 2. Objectives

After completing this module:

- Assessment attempts can be evaluated.
- Scores are calculated consistently.
- Performance summaries are generated.
- Results are stored and retrieved efficiently.
- Participants can review their outcomes according to assessment settings.

---

# 3. Prerequisites

Complete before starting:

- Development documents 00–10

Review architecture:

- 18_RESULTS_AND_ANALYTICS.md
- 12_ASSESSMENT_MODE.md
- 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement a reliable Results module that evaluates completed assessment attempts and generates structured performance data.

## Expected Output

The module should support:

- Score calculation
- Pass/fail evaluation
- Section-wise performance
- Performance summaries
- Result retrieval
- Result review (when enabled)

## Files Allowed to Modify

- `src/features/results/`
- `src/services/results/`
- Shared scoring utilities
- Result schemas

## Files That Must NOT Be Modified

- Assessment Module
- Question Bank
- Leaderboard
- AI Orchestrator

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── results/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── api/
│       ├── scoring/
│       ├── analytics/
│       ├── validators/
│       ├── schemas/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

---

# 6. Result Lifecycle

```text
Completed Attempt
        ↓
Validation
        ↓
Score Calculation
        ↓
Performance Analysis
        ↓
Result Generation
        ↓
Persistence
        ↓
Available for Review
```

A generated result should be immutable. Any re-evaluation should create a new version or audit entry.

---

# 7. Scoring Responsibilities

Support configurable scoring rules, including:

- Correct answer scoring
- Incorrect answer scoring
- Negative marking (optional)
- Unanswered questions
- Partial credit (future-ready)
- Section-specific scoring (future-ready)

Keep scoring logic isolated from presentation logic.

---

# 8. Frontend Tasks

Implement:

- Results dashboard
- Individual result page
- Section-wise breakdown
- Question review (if enabled)
- Score summary
- Pass/fail indicator
- Performance charts (future-ready)
- Empty, loading, and error states

Display only information permitted by the assessment configuration.

---

# 9. Backend Tasks

Implement services for:

- Evaluate attempt
- Calculate score
- Generate summary
- Store result
- Retrieve participant result
- Retrieve administrative result
- Audit result generation

Evaluation should be deterministic and repeatable.

---

# 10. Database Tasks

Create or verify support for:

- Result entity
- Section summaries
- Score details
- Evaluation metadata
- Audit history

Maintain referential integrity with assessment attempts.

---

# 11. Validation Rules

Validate:

- Completed attempt
- Assessment configuration
- Question scoring rules
- Duplicate evaluations
- Authorized result access

Reject evaluations for incomplete attempts unless explicitly supported.

---

# 12. State Management

Manage:

- Current result
- Loading state
- Review mode
- Section summaries
- Question review state
- Error state

Keep result state synchronized with backend updates.

---

# 13. Security Requirements

Ensure:

- Participants access only their own results unless sharing is enabled.
- Administrative access follows role-based permissions.
- Results cannot be modified after publication.
- Sensitive scoring metadata is protected.

---

# 14. User Experience

The Results interface should provide:

- Clear score presentation
- Easy-to-read summaries
- Section performance
- Optional answer review
- Consistent navigation

Avoid overwhelming users with unnecessary technical details.

---

# 15. Testing Checklist

Verify:

- Scores are calculated correctly.
- Negative marking behaves correctly.
- Pass/fail evaluation is accurate.
- Results persist correctly.
- Review mode respects configuration.
- Unauthorized access is blocked.
- Audit records are created.

---

# 16. Acceptance Criteria

The module is complete when:

- Scores are generated accurately.
- Results are stored reliably.
- Review works according to assessment settings.
- Security requirements are satisfied.
- Tests pass.

---

# 17. Common Mistakes

Avoid:

- Mixing leaderboard logic into results.
- Recalculating scores unnecessarily.
- Allowing edits to published results.
- Exposing restricted review information.
- Embedding presentation logic inside scoring services.

---

# 18. Definition of Done

The Results module is complete when:

- Completed attempts can be evaluated consistently.
- Results are reliable and immutable.
- Participants and administrators receive appropriate views.
- The implementation aligns with the project architecture.

---

# 19. Next Development Module

Proceed to:

**12_LEADERBOARD.md**
