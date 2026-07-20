# 09_PRACTICE_MODE.md

> **Project:** Companio
> **Document:** Practice Mode Development Guide
> **Version:** 1.0
> **Status:** Ready for Implementation

---

# 1. Purpose

This document defines how to implement the Practice Mode module.

Practice Mode provides an interactive learning experience where participants improve their understanding through immediate feedback, explanations, and repeated attempts.

Unlike the Assessment Engine, Practice Mode is designed for learning rather than formal evaluation.

---

# 2. Objectives

After completing this module:

- Users can start Practice Sessions.
- Questions are delivered from the Question Bank.
- Progress is tracked.
- Immediate feedback is available.
- Sessions can be resumed.
- Results are saved for personal learning history.

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
- 08_QUESTION_BANK.md

Review architecture:

- 11_PRACTICE_MODE.md
- 15_QUESTION_BANK.md
- 21_PROJECT_CONSTITUTION.md

---

# 4. AI Agent Context

## Goal

Implement a Practice Session system that delivers reusable questions for self-learning while keeping learning progress separate from formal assessments.

## Expected Output

A complete Practice Mode module supporting:

- Session creation
- Question delivery
- Answer submission
- Immediate feedback
- Explanations
- Progress tracking
- Resume capability
- Session history

## Files Allowed to Modify

- `src/features/practice/`
- `src/services/practice/`
- Shared session utilities

## Files That Must NOT Be Modified

- Assessment Engine
- Results module
- Leaderboard
- AI Provider implementations

---

# 5. Recommended Folder Structure

```text
src/
├── features/
│   └── practice/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       ├── api/
│       ├── session/
│       ├── validators/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

---

# 6. Practice Session Lifecycle

Every Practice Session follows this lifecycle:

```text
Created
    ↓
Started
    ↓
In Progress
    ↓
Paused
    ↓
Resumed
    ↓
Completed
```

A completed Practice Session should become read-only.

---

# 7. Question Delivery

Questions should be selected from the Question Bank based on:

- Selected topic
- Difficulty level
- Question type
- Practice configuration

Support future extensions such as adaptive question selection without changing the session lifecycle.

---

# 8. Frontend Tasks

Implement:

- Practice setup page
- Session screen
- Question navigation
- Progress indicator
- Timer (optional)
- Immediate feedback panel
- Explanation panel
- Pause and resume controls
- Session summary
- History page
- Empty, loading, and error states

The interface should prioritize a smooth and distraction-free learning experience.

---

# 9. Backend Tasks

Implement services for:

- Create Practice Session
- Load questions
- Save answers
- Evaluate answers
- Return explanations
- Update progress
- Resume session
- Complete session
- Retrieve session history

All operations must enforce ownership and permissions.

---

# 10. Database Tasks

Create or verify support for:

- Practice Session entity
- Session answers
- Progress tracking
- Completion status
- Attempt timestamps

Ensure historical practice data remains available for review.

---

# 11. Validation Rules

Validate:

- Session ownership
- Question availability
- Submitted answers
- Session status
- Completion rules

Reject invalid actions such as answering a completed session.

---

# 12. State Management

Manage:

- Current session
- Active question
- User answers
- Progress
- Timer (if enabled)
- Feedback visibility
- Loading state
- Error state

Persist session state to support resume after page refresh.

---

# 13. API Integration

Implement operations for:

- Start session
- Fetch questions
- Save answer
- Retrieve explanation
- Pause session
- Resume session
- Complete session
- Retrieve history

Keep API contracts stable for future clients.

---

# 14. Security Requirements

Ensure:

- Users can access only their own Practice Sessions.
- Session data is protected by authorization.
- Input is validated.
- Client-side progress cannot overwrite protected data.

---

# 15. User Experience

The interface should provide:

- Fast question transitions
- Immediate feedback
- Clear explanations
- Visible progress
- Resume after interruption
- Helpful completion summary

Learning should feel continuous and encouraging.

---

# 16. Testing Checklist

Verify:

- Session creation succeeds.
- Questions load correctly.
- Answers are saved.
- Feedback appears immediately.
- Progress updates correctly.
- Sessions resume successfully.
- Completed sessions become read-only.
- History is available.

---

# 17. Acceptance Criteria

The module is complete when:

- Practice Sessions function end-to-end.
- Progress is tracked accurately.
- Immediate feedback works.
- Resume capability is reliable.
- Tests pass.

---

# 18. Common Mistakes

Avoid:

- Mixing Practice Mode with Assessment logic.
- Showing leaderboard rankings.
- Generating new AI questions during a session.
- Allowing edits after session completion.
- Ignoring session persistence.

---

# 19. Definition of Done

The Practice Mode module is complete when:

- Users can complete self-learning sessions.
- Progress and history are maintained.
- Feedback is immediate.
- The implementation follows project architecture and standards.

---

# 20. Next Development Module

Proceed to:

**10_ASSESSMENT_MODULE.md**
