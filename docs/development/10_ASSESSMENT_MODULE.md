# 10_ASSESSMENT_MODULE.md

> **Project:** Companio
> **Document:** Assessment Module Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Assessment Module.

The Assessment Module enables creators to build formal assessments from reusable Question Banks, publish them, manage participant attempts, and produce reliable evaluation data.

Unlike Practice Mode, assessments are controlled, time-bound (when configured), and intended for evaluation rather than learning.

---

# 2. Objectives

After completing this module:

* Assessment Templates can be created.
* Published Assessments can be generated.
* Participants can join assessments.
* Attempts are tracked.
* Timers are supported.
* Automatic submission works.
* Results are generated for evaluation.

---

# 3. Prerequisites

Complete before starting:

* Development documents 00–09

Review architecture:

* 12_ASSESSMENT_MODE.md
* 15_QUESTION_BANK.md
* 18_RESULTS_AND_ANALYTICS.md
* 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement the complete assessment lifecycle from template creation to participant submission without regenerating questions.

## Expected Output

A module supporting:

* Assessment Template management
* Publishing assessments
* Secure participant attempts
* Timer management
* Question navigation
* Submission workflow
* Auto-submission
* Attempt persistence

## Files Allowed to Modify

* `src/features/assessment/`
* `src/services/assessment/`
* Assessment routing
* Shared utilities related to assessment flow

## Files That Must NOT Be Modified

* AI Orchestrator
* AI Content Processing
* Question Bank generation
* Leaderboard calculations

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── assessment/
│       ├── templates/
│       ├── published/
│       ├── attempts/
│       ├── timer/
│       ├── navigation/
│       ├── submission/
│       ├── services/
│       ├── validators/
│       ├── components/
│       ├── hooks/
│       └── index.ts
```

---

# 6. Assessment Lifecycle

```text
Question Bank
      ↓
Assessment Template
      ↓
Published Assessment
      ↓
Participant Attempt
      ↓
Submission
      ↓
Evaluation
      ↓
Result
```

Published Assessments are immutable. Any changes require publishing a new version.

---

# 7. Frontend Tasks

Implement:

* Assessment Template list
* Create/Edit Template
* Publish Assessment
* Assessment details
* Participant landing page
* Attempt screen
* Question navigation
* Progress indicator
* Countdown timer
* Submit confirmation
* Auto-submit notification
* Completion screen

Provide responsive layouts and accessibility support.

---

# 8. Backend Tasks

Implement services for:

* Create Template
* Update Template
* Publish Assessment
* Start Attempt
* Load Questions
* Save Answers
* Auto-save progress
* Submit Attempt
* Auto-submit on timeout
* Lock completed attempts

---

# 9. Database Tasks

Create or verify support for:

* Assessment Templates
* Published Assessments
* Participant Attempts
* Attempt Answers
* Submission records
* Timing metadata

Ensure foreign keys and indexes support efficient retrieval.

---

# 10. Validation Rules

Validate:

* Assessment ownership
* Publication state
* Attempt eligibility
* Timer rules
* Submission state
* Question availability

Prevent duplicate or invalid submissions.

---

# 11. State Management

Manage:

* Current assessment
* Attempt
* Active question
* Answers
* Timer
* Navigation state
* Submission state
* Error state

Support recovery after browser refresh when appropriate.

---

# 12. Security Requirements

Ensure:

* Participants access only authorized assessments.
* Published Assessments cannot be modified.
* Attempts cannot be altered after submission.
* Timer logic is enforced server-side where required.
* Input is validated and sanitized.

---

# 13. User Experience

The assessment experience should provide:

* Clear instructions
* Reliable timer
* Auto-save
* Smooth navigation
* Submission confirmation
* Consistent completion flow

The interface should minimize distractions during evaluation.

---

# 14. Testing Checklist

Verify:

* Templates are created successfully.
* Assessments publish correctly.
* Participants start attempts.
* Answers auto-save.
* Timer expires correctly.
* Auto-submit works.
* Submitted attempts become read-only.
* Evaluation is triggered successfully.

---

# 15. Acceptance Criteria

The module is complete when:

* Full assessment lifecycle functions correctly.
* Published Assessments remain immutable.
* Participant attempts are reliable.
* Submission and timing rules are enforced.
* Tests pass.

---

# 16. Common Mistakes

Avoid:

* Editing Published Assessments.
* Mixing Practice Mode logic into assessments.
* Regenerating AI questions during attempts.
* Allowing answer changes after submission.
* Trusting client-side timer enforcement alone.

---

# 17. Definition of Done

The Assessment Module is complete when:

* Templates, publication, attempts, and submission all work end-to-end.
* Data integrity is maintained.
* Security requirements are satisfied.
* The module integrates correctly with Results generation.

---

# 18. Next Development Module

Proceed to:

**11_RESULTS.md**
