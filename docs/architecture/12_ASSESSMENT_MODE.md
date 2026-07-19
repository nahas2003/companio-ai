# 12_ASSESSMENT_MODE.md

> **Project:** Companio
> **Document:** Assessment Mode Specification
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–11

---

# 1. Purpose

Assessment Mode allows authenticated users to create, configure, publish, and manage structured assessments for participants.

Unlike Practice Mode, assessment results can contribute to leaderboards and historical records.

---

# 2. Objectives

Assessment Mode should:

* Create reusable assessments.
* Reuse existing Question Banks.
* Support guest participants.
* Produce reliable results.
* Maintain assessment integrity.

---

# 3. Core Concepts

## Source

Original learning material.

Examples:

* PDF
* Topic
* Notes

---

## Question Bank

AI-generated questions derived from the source.

Reusable across multiple assessments.

---

## Assessment Template

Configuration owned by the creator.

Contains:

* Selected questions
* Timer
* Passing score
* Shuffle options
* Availability settings

Templates are editable.

---

## Published Assessment

Immutable assessment shared with participants.

Contains:

* Assessment code
* Publication timestamp
* Configuration snapshot
* Participant records

Once published, participant-facing behavior should remain stable.

---

# 4. Workflow

```text id="asm001"
Login
   │
   ▼
Choose Source
   │
   ▼
Question Bank
   │
   ▼
Create Template
   │
   ▼
Configure Assessment
   │
   ▼
Preview
   │
   ▼
Publish
   │
   ▼
Generate Assessment Code
   │
   ▼
Participants Join
```

---

# 5. Functional Requirements

Creators must be able to:

* Create assessments.
* Edit templates before publishing.
* Publish assessments.
* Duplicate templates.
* Archive templates.
* View participant results.

---

# 6. Assessment Configuration

Supported settings:

* Title
* Description
* Question count
* Timer
* Shuffle questions
* Shuffle options
* Passing score
* Visibility
* Availability window (future)
* Attempt limit (future)

---

# 7. Participant Experience

Participants should:

* Enter assessment code.
* Enter display name (guest) or sign in.
* Join assessment.
* Read instructions.
* Start assessment.
* Submit responses.
* View results (subject to creator settings).

---

# 8. Publishing Rules

Publishing should:

* Generate a unique assessment code.
* Freeze the participant-facing configuration.
* Record publication metadata.
* Make the assessment discoverable only by code (MVP).

---

# 9. Attempt Rules

For the MVP:

* One active attempt per participant per published assessment.
* Automatic submission when the timer expires.
* Prevent duplicate submissions.

Future versions may allow configurable multiple attempts.

---

# 10. Results

Creators can view:

* Total participants.
* Average score.
* Highest score.
* Lowest score.
* Completion rate.

Participants see only the information permitted by assessment settings.

---

# 11. APIs

Primary endpoints:

* `POST /assessments`
* `PUT /assessments/{id}`
* `POST /assessments/{id}/publish`
* `POST /assessments/{code}/join`
* `POST /attempts/start`
* `POST /attempts/{id}/submit`

---

# 12. Database Usage

Primary entities:

* sources
* question_banks
* questions
* assessment_templates
* published_assessments
* participants
* attempts
* answers

---

# 13. Security

Validate:

* Creator ownership.
* Assessment publication permissions.
* Participant access.
* Assessment code validity.
* Timer integrity.

Never allow clients to manipulate scores or timers.

---

# 14. Error Handling

Handle:

* Invalid assessment code.
* Expired assessment.
* Already submitted attempt.
* Missing questions.
* AI generation failure.
* Publication failure.
* Network interruption.

Return clear, user-friendly messages.

---

# 15. Edge Cases

Examples:

* Publishing with zero questions.
* Duplicate assessment titles.
* Question Bank deleted after template creation.
* Participant reconnects during an active attempt.
* Browser refresh during assessment.

---

# 16. Future Enhancements

* Scheduled publication.
* Password-protected assessments.
* Team assessments.
* Coding assessments.
* Essay assessments.
* Section-based exams.
* Negative marking.
* Adaptive assessments.

---

# 17. AI Implementation Rules

Every AI coding agent must:

* Separate templates from published assessments.
* Reuse Question Banks.
* Preserve immutable published assessments.
* Keep participant data isolated from creator configuration.
* Follow documented workflows and APIs.

---

# 18. Acceptance Criteria

Assessment Mode is complete when:

* Templates can be created.
* Templates can be edited.
* Assessments can be published.
* Participants can join using a code.
* Attempts are recorded.
* Results are generated.
* Leaderboards update correctly.
* Security and validation rules pass.

---

# 19. Dependencies

Depends on:

* 00–11

Referenced by:

* 15_QUESTION_BANK.md
* 16_AUTHENTICATION.md
* 17_LEADERBOARD.md
* 18_RESULTS_AND_HISTORY.md
