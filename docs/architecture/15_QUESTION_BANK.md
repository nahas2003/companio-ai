# 15_QUESTION_BANK.md

> **Project:** Companio
> **Document:** Question Bank Specification
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–14

---

# 1. Purpose

The Question Bank is the central repository of AI-generated questions.

It acts as the reusable knowledge layer between Sources and Assessments.

Question Banks are reusable, versioned, and independent of any single assessment.

---

# 2. Objectives

The Question Bank should:

- Minimize AI generation costs.
- Maximize content reuse.
- Preserve generation history.
- Support multiple assessment templates.
- Enable future learning features.

---

# 3. Core Concepts

A Question Bank represents a validated collection of questions generated from a single Source using a defined AI generation strategy.

A Question Bank may have multiple versions over time.

---

# 4. Lifecycle

```text
Source
   │
   ▼
Question Bank Created
   │
   ▼
Questions Validated
   │
   ▼
Version Published
   │
   ▼
Referenced by Templates
   │
   ▼
Referenced by Published Assessments
```

---

# 5. Versioning

Each version should record:

- Version number
- Prompt template version
- AI provider
- AI model
- Generation parameters
- Creation timestamp

Existing versions are immutable.

---

# 6. Functional Requirements

Creators should be able to:

- Generate a new Question Bank.
- View Question Banks.
- Regenerate a new version.
- Reuse an existing Question Bank.
- Archive unused Question Banks.
- Search Question Banks.

---

# 7. Question Model

Each question should contain:

- Question text
- Question type
- Options
- Correct answer
- Explanation
- Difficulty
- Tags
- Estimated time
- Metadata

Future fields may be added without changing existing contracts.

---

# 8. Difficulty Levels

Supported:

- Easy
- Medium
- Hard

Future:

- Adaptive
- Bloom's Taxonomy levels

---

# 9. Question Types

MVP:

- Single-choice multiple choice

Future:

- Multiple-choice (multiple answers)
- True/False
- Fill in the blank
- Matching
- Ordering
- Coding
- Essay

---

# 10. Validation

Before storing:

- Required fields exist.
- Correct answer is valid.
- Option count is correct.
- Duplicate questions removed.
- JSON contract verified.

---

# 11. Search

Support:

- Title
- Tags
- Difficulty
- Source
- Owner
- Creation date

Future:

- Semantic search.

---

# 12. Reuse Strategy

Before generating:

1. Search for matching Source.
2. Search for compatible Question Bank version.
3. Reuse if suitable.
4. Otherwise generate a new version.

---

# 13. Relationships

```text
Source
   │
   ▼
Question Bank
   │
   ▼
Questions
   │
   ▼
Assessment Templates
```

Questions are never duplicated into templates.

Templates reference questions.

---

# 14. Storage

Store:

- Metadata
- Generation settings
- Version information
- Question records

Do not store provider-specific response formats.

---

# 15. APIs

Primary endpoints:

- `POST /question-banks`
- `GET /question-banks`
- `GET /question-banks/{id}`
- `POST /question-banks/{id}/versions`
- `GET /question-banks/{id}/versions`

---

# 16. Security

Rules:

- Only owners may manage private Question Banks.
- Shared Question Banks must respect access permissions.
- Archived versions remain read-only.
- Immutable versions cannot be edited.

---

# 17. Performance

Recommendations:

- Index Source hashes.
- Cache frequently accessed Question Banks.
- Lazy load questions where appropriate.
- Avoid unnecessary regeneration.

---

# 18. Future Enhancements

- Community Question Banks
- Organization libraries
- AI quality scoring
- Human review workflow
- Semantic similarity search
- Difficulty calibration
- Multi-language versions

---

# 19. AI Implementation Rules

Every AI coding agent must:

- Reuse Question Banks whenever possible.
- Preserve version history.
- Keep versions immutable.
- Never overwrite generated history.
- Follow documented validation rules.

---

# 20. Acceptance Criteria

The feature is complete when:

- Question Banks can be created.
- Versions can be generated.
- Existing versions remain immutable.
- Questions are reusable.
- Duplicate generation is minimized.
- Search works.
- Validation passes.
- Security rules are enforced.

---

# 21. Dependencies

Depends on:

- 00–14

Referenced by:

- 11_PRACTICE_MODE.md
- 12_ASSESSMENT_MODE.md
- 18_RESULTS_AND_HISTORY.md
