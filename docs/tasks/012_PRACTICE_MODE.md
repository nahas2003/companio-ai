# 012_PRACTICE_MODE.md

> **Project:** Companio
> **Task ID:** 012
> **Task Name:** Practice Mode
> **Priority:** High
> **Estimated Complexity:** High

---

# 1. Purpose

Implement Practice Mode, allowing learners to practice using questions stored in the Question Bank.

Practice Mode is designed for learning and self-improvement. Users receive immediate feedback after answering questions, helping them understand mistakes before attempting formal assessments.

---

# 2. Business Goal

Provide an engaging practice environment that helps learners improve their understanding and confidence before taking assessments.

---

# 3. User Story

**As a learner, I want to practice AI-generated questions with immediate feedback so that I can strengthen my understanding before taking an assessment.**

---

# 4. Objective

At the end of this task, users should be able to:

- Create a practice session.
- Select practice options.
- Answer questions.
- Receive instant feedback.
- Review their performance.
- Resume unfinished practice sessions.

---

# 5. MVP Implementation

Implement:

### Practice Session

- Start practice
- Resume practice
- Restart practice
- End practice

### Question Selection

Support filtering by:

- Subject
- Topic
- Difficulty
- Question type
- Source document

### Practice Experience

- One question at a time
- Next / Previous navigation
- Skip question
- Mark for review
- Progress indicator

### Feedback

Provide:

- Correct answer
- User answer
- Explanation (if available)
- Correct/Incorrect indicator

### Session Summary

Display:

- Total questions
- Correct answers
- Incorrect answers
- Skipped questions
- Accuracy percentage
- Time spent

---

# 6. Future Enhancements

Future versions may include:

- Adaptive practice
- AI-generated hints
- Flashcard mode
- Spaced repetition
- Study streaks
- Daily practice goals
- Timed practice
- Gamification
- Achievement badges

---

# 7. Out of Scope

Do **not** implement:

- Formal assessments
- Exam security
- Certificates
- Rankings
- Leaderboards
- Assessment grading

Practice Mode is for learning only.

---

# 8. Required Reading

## Architecture

- Practice Mode specification
- Question Bank specification
- Master Project Specification
- System Architecture

## Development

- Coding Standards
- Performance Guidelines
- Error Handling
- AI Agent Workflow

---

# 9. Prerequisites

Complete:

- Tasks 001–011

Verify:

- Question Bank contains validated questions.
- Question search and filtering are operational.

---

# 10. Integration Points

### Input

- Questions from the Question Bank
- User preferences
- Practice settings

### Output

- Practice session
- User responses
- Session statistics
- Performance summary

Future Analytics modules will consume these outputs.

---

# 11. Files Allowed to Modify

The AI may modify:

- Practice pages
- Practice services
- Session management
- Question navigation
- Progress tracking
- Summary components

---

# 12. Files Not to Modify

Do **not** implement:

- Assessment module
- Exam timer
- Certificates
- Leaderboards
- Analytics dashboards

Only implement Practice Mode.

---

# 13. Database Changes

Implement support for:

- Practice sessions
- User responses
- Session progress
- Session summary
- Resume state
- Time tracking

---

# 14. Frontend Tasks

Implement:

- Practice setup page
- Question player
- Navigation controls
- Progress indicator
- Answer submission
- Instant feedback
- Session summary
- Resume prompt
- Empty states
- Loading states

---

# 15. Backend Tasks

Implement:

- Practice session creation
- Question retrieval
- Answer validation
- Progress persistence
- Resume functionality
- Session completion
- Statistics calculation

---

# 16. AI Implementation Rules

The AI must:

- Retrieve questions only from the Question Bank.
- Never modify Question Bank content during practice.
- Save progress automatically.
- Support interrupted sessions.
- Keep practice logic independent from assessment logic.

---

# 17. Implementation Checklist

- Practice session creation implemented
- Question navigation completed
- Answer submission implemented
- Instant feedback available
- Session resume supported
- Progress auto-save implemented
- Session summary completed

---

# 18. Testing Checklist

Verify:

- Practice sessions start successfully.
- Questions display correctly.
- Answers are evaluated correctly.
- Feedback appears immediately.
- Resume restores progress accurately.
- Session summary calculations are correct.
- Empty Question Bank is handled gracefully.

---

# 19. Acceptance Criteria

Task is complete when:

- Learners can complete practice sessions.
- Immediate feedback is available.
- Sessions can be resumed.
- Progress is saved correctly.
- Summary statistics are accurate.

---

# 20. Definition of Done

Practice Mode is complete when:

- Session lifecycle is functional.
- Feedback is reliable.
- Resume works correctly.
- Performance summary is accurate.
- Tests pass.

---

# 21. Deliverables

Expected outputs:

- Practice Mode pages
- Practice session engine
- Question player
- Feedback components
- Session summary
- Resume functionality
- Supporting tests

---

# 22. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the Practice Mode module.

Do not implement Assessment Mode, Results, Certificates, Leaderboards, or Analytics.

Use questions exclusively from the Question Bank.

Provide immediate feedback after each answer and support resuming interrupted sessions.

Follow the project's coding standards, security checklist, and AI workflow.

Run all applicable validation and tests.

Provide a summary of changes, modified files, and testing results.

---

# 23. Next Task

Proceed to:

**013_ASSESSMENT_MANAGEMENT.md**
