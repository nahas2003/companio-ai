# 06_BUSINESS_WORKFLOWS.md

> **Project:** Companio
> **Version:** 1.0 (MVP)
> **Document:** Business Workflows
> **Priority:** Critical
> **Depends On:** 00–05

---

# 1. Purpose

This document defines every business workflow in Companio.

A workflow represents the complete sequence of actions from the user's perspective. APIs, database operations, and UI behavior must support these workflows rather than defining them independently.

Every new feature introduced in the future must begin by documenting its workflow before implementation.

---

# 2. Workflow Principles

Each workflow should:

- Start with a clear trigger.
- Produce a measurable outcome.
- Define decision points.
- Handle failures gracefully.
- Avoid unnecessary user steps.
- Be reusable across web and mobile applications.

---

# 3. Home Workflow

```text
Open Website
      │
      ▼
Landing Page
      │
      ├── Practice
      ├── Create Assessment
      ├── Join Assessment
      └── Login
```

Outcome:

The user reaches the desired feature with minimal navigation.

---

# 4. Practice Workflow

## Trigger

User selects **Practice**.

```text
Practice
      │
      ▼
Choose Input Method
      │
      ├── Topic
      ├── PDF
      └── Notes
              │
              ▼
Generate Source Hash
              │
              ▼
Question Bank Exists?
        │             │
       Yes           No
        │             │
        ▼             ▼
 Load Questions   Generate with AI
        │             │
        └──────┬──────┘
               ▼
       Start Practice
               ▼
       Submit Answers
               ▼
       Show Results
```

Outcome:

The user completes a practice session.

---

# 5. Assessment Creation Workflow

## Trigger

Authenticated user chooses **Create Assessment**.

```text
Login
   │
   ▼
Select Source
   │
   ▼
Generate Questions
   │
   ▼
Review Questions
   │
   ▼
Edit Metadata
   │
   ▼
Configure Timer
   │
   ▼
Publish
   │
   ▼
Generate Assessment Code
```

Outcome:

A shareable assessment is created.

---

# 6. Join Assessment Workflow

## Trigger

Participant enters an assessment code.

```text
Enter Code
      │
      ▼
Assessment Exists?
      │
 ┌────┴────┐
 │         │
No        Yes
 │         │
 ▼         ▼
Error   Enter Display Name
              │
              ▼
        Join Assessment
              ▼
        Wait (if scheduled)
              ▼
          Start Quiz
              ▼
          Submit Quiz
              ▼
        Show Results
```

Outcome:

The participant successfully completes the assessment.

---

# 7. AI Question Generation Workflow

```text
Receive Source
      │
      ▼
Validate Input
      │
      ▼
Generate SHA-256 Hash
      │
      ▼
Question Bank Exists?
      │
 ┌────┴────┐
 │         │
Yes       No
 │         │
 ▼         ▼
Reuse    Build Prompt
               │
               ▼
         Call AI Provider
               ▼
       Validate JSON Output
               ▼
     Store Question Bank
               ▼
      Return Questions
```

Outcome:

Questions are generated once and reused whenever possible.

---

# 8. Assessment Attempt Workflow

```text
Start Assessment
       │
       ▼
Load Questions
       │
       ▼
Answer Questions
       │
       ▼
Timer Ends?
   │        │
  No       Yes
   │        │
   ▼        ▼
Continue  Auto Submit
       │
       ▼
Calculate Score
       ▼
Store Attempt
       ▼
Update Leaderboard
       ▼
Display Results
```

Outcome:

The participant's attempt is securely recorded.

---

# 9. Leaderboard Workflow

```text
Assessment Completed
        │
        ▼
Retrieve Attempts
        ▼
Rank by Score
        ▼
Tie Break by Time Taken
        ▼
Generate Positions
        ▼
Display Leaderboard
```

Outcome:

Participants can compare their performance fairly.

---

# 10. Authentication Workflow

### Guest User

```text
Open Assessment
      │
      ▼
Enter Display Name
      │
      ▼
Join
```

No account is required.

---

### Registered User

```text
Login
    │
    ▼
Access Dashboard
    ▼
Create Assessments
    ▼
View History
```

Outcome:

Authenticated users gain persistent features while guests enjoy frictionless participation.

---

# 11. Failure Handling

Every workflow must define expected failures.

Examples:

- Invalid assessment code.
- Unsupported file type.
- AI provider unavailable.
- Network interruption.
- Timer expiration.
- Empty input.
- Corrupted upload.

Users should receive clear, actionable messages rather than technical errors.

---

# 12. Cross-Workflow Rules

- Practice sessions do not affect assessment leaderboards.
- Assessments always reference a Question Bank.
- Guests cannot access creator features.
- AI generation must always check the cache before contacting a provider.
- Every assessment attempt must be stored before displaying final results.

---

# 13. AI Implementation Rules

Before implementing any feature, an AI agent must:

1. Identify the relevant workflow.
2. Verify all workflow steps are implemented.
3. Respect decision points.
4. Implement failure paths.
5. Avoid introducing additional user steps unless approved.

---

# 14. Validation Checklist

Before a workflow is considered complete:

- Every step is implemented.
- Decision points are handled.
- Success path works.
- Failure path works.
- Database updates are correct.
- Security checks occur at the appropriate stage.
- UI matches the documented flow.

---

# 15. Dependencies

Depends on:

- 00_PROJECT_OVERVIEW.md
- 01_PRODUCT_REQUIREMENTS.md
- 02_SYSTEM_ARCHITECTURE.md
- 03_TECH_STACK.md
- 04_PROJECT_STRUCTURE.md
- 05_DATABASE_ARCHITECTURE.md

Referenced by:

- 07_API_SPECIFICATION.md
- 08_SECURITY_ARCHITECTURE.md
- 09_AI_ARCHITECTURE.md
- All feature specification documents.
