# 05_DATABASE_ARCHITECTURE.md

> **Project:** Companio
> **Version:** 1.0 (MVP)
> **Document:** Database Architecture
> **Database:** PostgreSQL (Supabase)
> **Priority:** Critical

---

# 1. Purpose

This document defines the logical database architecture for Companio.

The goals are:

* Simple
* Secure
* Normalized
* Scalable
* AI-friendly
* Cost-efficient
* Easy to maintain

---

# 2. Database Design Principles

The database must:

* Avoid duplicate data.
* Store AI results for reuse.
* Minimize AI API calls.
* Support guest users.
* Support authenticated users.
* Support future expansion.

---

# 3. Core Domain Model

The system is built around these entities.

```text
User

Question Bank

Assessment

Question

Participant

Attempt

Answer

Leaderboard
```

Everything else is derived from these.

---

# 4. Entity Relationships

```text
User
│
├── owns
│
Assessment
│
├── uses
│
Question Bank
│
├── contains
│
Questions
│
├── has many
│
Participants
│
├── has many
│
Attempts
│
└── Leaderboard
```

---

# 5. Tables

## users

Purpose

Stores registered users.

Contains:

* id
* email
* display_name
* avatar_url
* created_at
* updated_at

---

## question_banks

Purpose

Stores AI-generated question collections.

One question bank may be reused by many assessments.

Contains:

* id
* owner_id
* source_type
* source_hash
* title
* ai_provider
* ai_model
* total_questions
* status
* created_at

---

## questions

Purpose

Stores every generated question.

Contains:

* id
* question_bank_id
* question
* option_a
* option_b
* option_c
* option_d
* correct_answer
* explanation
* difficulty
* created_at

---

## assessments

Purpose

Represents a published assessment.

Contains:

* id
* owner_id
* question_bank_id
* assessment_code
* title
* timer_minutes
* total_questions
* status
* created_at

---

## participants

Purpose

Stores participants for each assessment.

Supports:

* Guest users
* Registered users

Contains:

* id
* assessment_id
* user_id (nullable)
* guest_name
* joined_at

---

## attempts

Purpose

Stores every assessment attempt.

Contains:

* id
* participant_id
* assessment_id
* score
* correct_answers
* incorrect_answers
* time_taken
* submitted_at

---

## answers

Purpose

Stores submitted answers.

Contains:

* id
* attempt_id
* question_id
* selected_answer
* is_correct
* answered_at

---

# 6. Guest User Strategy

Guest users are never stored as accounts.

Instead:

```text
Participant

↓

guest_name

↓

Assessment

↓

Attempt
```

No registration required.

---

# 7. Registered User Strategy

Registered users are linked through:

```text
Auth

↓

users

↓

participant

↓

attempt
```

This allows:

* History
* Statistics
* Progress tracking

---

# 8. AI Cache Strategy

Every uploaded document or topic generates a hash.

Workflow:

```text
Upload

↓

SHA-256 Hash

↓

Question Bank Exists?

↓

YES

↓

Reuse Questions

↓

NO

↓

Call AI

↓

Store Question Bank
```

This minimizes AI costs.

---

# 9. Assessment Strategy

Assessment stores:

* Timer
* Code
* Owner
* Selected Question Bank

Questions are never duplicated.

---

# 10. Leaderboard Strategy

Leaderboard is generated from:

Attempts

↓

Score

↓

Time

↓

Ranking

No duplicate leaderboard table is required for the MVP.

---

# 11. Relationships

users

1

↓

many

assessments

---

question_banks

1

↓

many

questions

---

question_banks

1

↓

many

assessments

---

assessment

1

↓

many

participants

---

participant

1

↓

many

attempts

---

attempt

1

↓

many

answers

---

# 12. Security Principles

Every table must:

* Enable Row Level Security.
* Validate ownership.
* Prevent unauthorized updates.
* Prevent unauthorized deletion.
* Restrict sensitive fields.

---

# 13. Performance

Indexes required:

* assessment_code
* owner_id
* question_bank_id
* participant_id
* source_hash
* created_at

---

# 14. Future Expansion

The schema should support:

* Coding questions
* Essay questions
* Flashcards
* AI tutor
* Multiple attempts
* Teams
* Organizations

without redesigning existing tables.

---

# 15. AI Implementation Rules

AI agents must:

* Never duplicate questions.
* Reuse Question Banks.
* Preserve relationships.
* Respect foreign keys.
* Never bypass security rules.

---

# 16. Validation Checklist

Before database changes:

✓ Schema reviewed

✓ Foreign keys verified

✓ Indexes added

✓ RLS enabled

✓ No duplicated data

✓ Migration tested

✓ Existing data preserved

---

# 17. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md
* 04_PROJECT_STRUCTURE.md

Referenced by:

* 06_API_SPECIFICATION.md
* 07_SECURITY_ARCHITECTURE.md
* 08_AI_ARCHITECTURE.md
* Feature modules
