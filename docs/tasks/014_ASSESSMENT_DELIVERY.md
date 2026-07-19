# 014_ASSESSMENT_DELIVERY.md

> **Project:** Companio
> **Task ID:** 014
> **Task Name:** Assessment Delivery
> **Priority:** Critical
> **Estimated Complexity:** High

---

# 1. Purpose

Implement the Assessment Delivery module.

This module presents published assessments to learners, enforces assessment rules, records responses, manages timing, and securely completes submissions.

---

# 2. Business Goal

Provide a secure, reliable, and intuitive assessment experience that follows the configuration defined in the Assessment Management module.

---

# 3. User Story

**As a learner, I want to take an assessment in a structured environment so that my knowledge can be evaluated fairly and accurately.**

---

# 4. Objective

At the end of this task:

* Learners can start published assessments.
* Questions are displayed according to assessment settings.
* Responses are automatically saved.
* Assessment rules are enforced.
* Completed assessments can be submitted securely.

---

# 5. MVP Implementation

Implement:

### Assessment Lifecycle

* Start assessment
* Resume assessment (if allowed)
* Pause (if permitted)
* Submit assessment
* Auto-submit when the timer expires

### Question Navigation

* Next / Previous
* Jump to question (if enabled)
* Mark for review
* Progress indicator
* Question palette

### Timer

Support:

* Countdown timer
* Auto-submit on timeout
* Timer persistence after refresh
* Warning before expiration

### Answer Management

* Save answers automatically
* Manual save (optional)
* Prevent data loss
* Restore interrupted sessions

---

# 6. Assessment Rules

Respect settings defined during assessment creation:

* Time limit
* Shuffle questions
* Shuffle answer choices
* Maximum attempts
* Resume permission
* Navigation restrictions

---

# 7. Future Enhancements

Future versions may include:

* Full-screen enforcement
* Browser focus monitoring
* Webcam proctoring
* Screen recording
* AI-based cheating detection
* Lockdown browser support
* Offline submission recovery

---

# 8. Out of Scope

Do **not** implement:

* Final grading
* Analytics dashboards
* Certificates
* Leaderboards
* Question editing

The module ends after successful submission.

---

# 9. Required Reading

## Architecture

* Assessment Delivery specification
* Assessment Management specification
* Question Bank specification
* Master Project Specification

## Development

* Coding Standards
* Security Checklist
* Error Handling
* Performance Guidelines
* AI Agent Workflow

---

# 10. Prerequisites

Complete:

* Tasks 001–013

Verify:

* Published assessments exist.
* Assessment configurations are valid.
* Question Bank is operational.

---

# 11. Integration Points

### Input

* Published assessment
* Assessment configuration
* Question Bank
* User session

### Output

* Learner responses
* Submission record
* Time tracking
* Assessment completion status

Future Results and Analytics modules consume these outputs.

---

# 12. Files Allowed to Modify

The AI may modify:

* Assessment player
* Navigation components
* Timer service
* Submission service
* Auto-save logic
* Session management
* Delivery APIs

---

# 13. Files Not to Modify

Do **not** implement:

* Results calculation
* Certificates
* Analytics
* Leaderboards
* Question Bank management

Only implement assessment delivery.

---

# 14. Database Changes

Implement support for:

* Assessment attempts
* User responses
* Timer state
* Progress state
* Submission records
* Resume information

---

# 15. Frontend Tasks

Implement:

* Assessment player
* Timer
* Question navigation
* Progress bar
* Question palette
* Review markers
* Submission confirmation
* Auto-save indicator
* Empty states
* Loading states

---

# 16. Backend Tasks

Implement:

* Assessment session creation
* Auto-save
* Answer persistence
* Resume support
* Submission processing
* Timer validation
* Attempt validation

---

# 17. AI Implementation Rules

The AI must:

* Respect assessment configuration.
* Prevent unauthorized assessment access.
* Save answers automatically.
* Protect against accidental data loss.
* Keep delivery independent from grading.

---

# 18. Implementation Checklist

* Assessment player implemented
* Timer operational
* Auto-save implemented
* Resume supported
* Navigation completed
* Submission workflow implemented
* Timeout handling completed

---

# 19. Testing Checklist

Verify:

* Assessment starts correctly.
* Timer counts down accurately.
* Auto-save works.
* Resume restores state.
* Submission succeeds.
* Auto-submit triggers on timeout.
* Navigation restrictions are respected.
* Maximum attempts are enforced.

---

# 20. Acceptance Criteria

Task is complete when:

* Learners can complete published assessments.
* Assessment rules are enforced.
* Responses are saved reliably.
* Submissions complete successfully.
* Assessment data is ready for grading.

---

# 21. Definition of Done

Assessment Delivery is complete when:

* Assessment lifecycle functions correctly.
* Auto-save is reliable.
* Timer enforcement works.
* Submission is secure.
* Tests pass.

---

# 22. Deliverables

Expected outputs:

* Assessment player
* Timer service
* Auto-save service
* Submission workflow
* Attempt management
* Supporting tests

---

# 23. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the Assessment Delivery module.

Do not implement grading, results, certificates, analytics, or leaderboards.

Use published assessments from the Assessment Management module and ensure responses are securely saved throughout the assessment lifecycle.

Follow the project's coding standards, security checklist, and AI workflow.

Run all applicable validation and tests.

Provide a summary of changes, modified files, and testing results.

---

# 24. Next Task

Proceed to:

**015_RESULTS_AND_GRADING.md**
