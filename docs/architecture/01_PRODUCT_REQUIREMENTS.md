# 01_PRODUCT_REQUIREMENTS.md

> **Project:** Companio
> **Document:** Product Requirements Document (PRD)
> **Version:** 1.0 (MVP)
> **Status:** Draft
> **Priority:** Critical
> **Depends On:** `00_PROJECT_OVERVIEW.md`

---

# 1. Purpose

This document defines the functional and non-functional requirements for Companio.

It serves as the single source of truth for what the application must do, how it should behave, and what is intentionally excluded from the MVP.

Any implementation must follow this document.

---

# 2. Product Summary

Companio is an AI-powered assessment platform that enables users to generate quizzes from:

* Topics
* Notes
* PDF documents

Users can:

* Practice individually
* Create live assessments
* Share assessment codes
* Allow participants to join instantly
* View live leaderboard
* Save progress (registered users)

---

# 3. Product Objectives

The MVP should:

* Minimize clicks required to start an assessment.
* Generate high-quality MCQs using AI.
* Support guest participation.
* Allow optional user registration.
* Be responsive across desktop and mobile.
* Be secure by default.
* Be modular and maintainable.

---

# 4. User Personas

## Guest Participant

Goals

* Join quickly
* Complete assessment
* View ranking

Pain Points

* Doesn't want registration
* Wants immediate access

---

## Registered User

Goals

* Save assessment history
* Track progress
* Create assessments

---

## Assessment Creator

Goals

* Upload learning material
* Generate questions
* Share assessment
* View results

---

# 5. Functional Requirements

## FR-01 Home

The system shall provide:

* Practice
* Create Assessment
* Join Assessment

No login required to access the home page.

---

## FR-02 Practice Mode

The system shall allow users to:

* Enter a topic.
* Upload a PDF.
* Paste notes.
* Generate AI questions.
* Choose the number of questions.
* Start a quiz immediately.

The system shall display:

* Score
* Correct answers
* Incorrect answers
* Explanation (if enabled)

---

## FR-03 Create Assessment

The system shall allow authenticated users to:

* Create a new assessment.
* Upload study material.
* Generate questions.
* Edit generated questions before publishing.
* Select question count.
* Configure timer (optional).
* Publish assessment.

The system shall generate a unique assessment code.

---

## FR-04 Join Assessment

The system shall allow users to:

* Enter assessment code.
* Enter display name.
* Join instantly.

Guest participation must not require registration.

---

## FR-05 Leaderboard

The system shall display:

* Participant name
* Current score
* Rank
* Completion status

Leaderboard updates should occur in near real time.

---

## FR-06 Results

The system shall display:

* Score
* Percentage
* Correct count
* Incorrect count
* Time taken
* Rank

Registered users shall retain attempt history.

---

## FR-07 Authentication

Authentication is optional.

Users may:

* Continue as guest.
* Register.
* Login.
* Logout.

Assessment creation requires authentication.

Practice mode does not.

---

## FR-08 AI Question Generation

The system shall support:

* Topic input
* PDF input
* Notes input

Output format:

* Question
* Four options
* Correct answer
* Explanation

Questions should be returned as structured JSON.

---

## FR-09 AI Cache

Before generating questions:

The system shall:

1. Search cache.
2. Return cached questions if available.
3. Otherwise call AI.
4. Save generated result.

---

## FR-10 Assessment Management

Creators shall be able to:

* View assessments
* Edit unpublished assessments
* Archive assessments
* Delete owned assessments

---

## FR-11 User History

Registered users shall have access to:

* Practice history
* Assessment history
* Scores
* Completion dates

Guests shall not have persistent history.

---

# 6. Non-Functional Requirements

## Performance

* First page load should be fast.
* AI requests should be cached.
* Database queries should be optimized.
* API responses should minimize payload size.

---

## Scalability

Architecture must support:

* Additional AI providers
* New question types
* New assessment modes
* Mobile applications

without requiring major refactoring.

---

## Reliability

The application should:

* Handle API failures gracefully.
* Recover from AI provider failures.
* Retry safe operations when appropriate.
* Prevent data corruption.

---

## Security

The application must:

* Validate every input.
* Validate uploaded files.
* Prevent SQL Injection.
* Prevent XSS.
* Prevent prompt injection.
* Enforce Row Level Security.
* Protect API secrets.
* Use HTTPS.
* Apply rate limiting to AI endpoints.

---

## Maintainability

The codebase shall:

* Follow feature-based architecture.
* Use reusable services.
* Avoid duplicated logic.
* Use strict TypeScript.
* Be fully documented.

---

## Accessibility

The application should:

* Support keyboard navigation.
* Provide sufficient color contrast.
* Use semantic HTML.
* Include accessible labels.
* Remain usable on mobile devices.

---

# 7. Business Rules

* Assessment codes must be unique.
* Every assessment has one owner.
* Guests cannot modify assessments.
* Only creators can edit their own assessments.
* Deleted assessments cannot be joined.
* Expired assessments cannot accept new participants.
* Results are immutable after submission.

---

# 8. Constraints

The MVP should:

* Use free AI providers where possible.
* Minimize AI API usage through caching.
* Minimize hosting costs.
* Support modern browsers.
* Avoid vendor lock-in.

---

# 9. Error Handling Requirements

The application shall provide user-friendly messages for:

* Invalid assessment code
* Invalid file upload
* Unsupported file type
* AI service unavailable
* Network failure
* Authentication failure
* Expired assessment
* Duplicate assessment creation attempts

Internal errors must not expose sensitive information.

---

# 10. Out of Scope (MVP)

The following features are intentionally excluded:

* AI Tutor
* Flashcards
* LMS
* Course Management
* Institute Management
* Batch Management
* Teacher Management
* Payments
* Certificates
* Discussion Forums
* Notifications
* Coding Assessments
* Essay Evaluation

---

# 11. Acceptance Criteria

The MVP is complete when users can:

* Practice from topics.
* Practice from notes.
* Practice from PDFs.
* Create assessments.
* Join as guests.
* Participate without login.
* View live leaderboard.
* Save history when registered.
* Generate AI questions reliably.
* Complete assessments without critical issues.

---

# 12. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md

Referenced by:

* 02_SYSTEM_ARCHITECTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_API_SPECIFICATION.md
* 07_SECURITY_ARCHITECTURE.md
* 08_AI_ARCHITECTURE.md
* All feature specification documents.
