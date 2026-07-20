# 11_PRACTICE_MODE.md

> **Project:** Companio
> **Document:** Practice Mode Specification
> **Version:** 1.0 (MVP)
> **Priority:** High
> **Depends On:** 00–10

---

# 1. Purpose

Practice Mode allows users to generate and complete AI-powered quizzes without creating a formal assessment.

It is designed for self-learning, revision, and knowledge evaluation.

Practice sessions are independent of assessment leaderboards.

---

# 2. Objectives

The feature should:

- Enable quick learning.
- Reuse existing Question Banks.
- Minimize AI generation costs.
- Provide immediate feedback.
- Support both guest and registered users.

---

# 3. Supported Practice Types

### Topic Practice

Example:

```text
Computer Networks
```

---

### PDF Practice

Upload a PDF and generate questions.

---

### Notes Practice

Paste plain text notes and generate questions.

---

### Saved Question Bank Practice

Reuse an existing Question Bank without invoking AI.

---

### Future Practice Types

- Incorrect Questions
- Bookmarked Questions
- Weak Topics
- Adaptive Practice

---

# 4. User Flow

```text
Home

↓

Practice

↓

Choose Practice Type

↓

Provide Content

↓

Generate Source Hash

↓

Question Bank Exists?

↓

Yes → Reuse

↓

No → AI Generation

↓

Create Practice Session

↓

Load Questions

↓

Answer Questions

↓

Submit

↓

Results
```

---

# 5. Practice Session

Every practice attempt creates one Practice Session.

Purpose:

- Track progress
- Store answers
- Support future resume functionality
- Enable analytics

Suggested fields:

- session_id
- practice_type
- user_id (nullable)
- question_bank_id
- status
- started_at
- completed_at

---

# 6. Functional Requirements

Users must be able to:

- Start practice.
- Pause (future).
- Resume (future).
- Submit manually.
- Auto-submit when configured.
- View results immediately.

---

# 7. Question Generation

Before generating questions:

1. Validate input.
2. Generate source hash.
3. Check Question Bank cache.
4. Reuse if available.
5. Generate only if necessary.

---

# 8. Question Presentation

Questions should support:

- Single correct answer (MVP)

Future support:

- Multiple correct answers
- True/False
- Fill in the blank
- Coding questions
- Essay questions

---

# 9. Timer

For the MVP:

- Optional timer.

If enabled:

- Countdown displayed.
- Auto-submit when expired.

---

# 10. Submission

Submission should:

- Calculate score.
- Store answers.
- Record completion time.
- Generate results.

---

# 11. Results

Display:

- Total score
- Correct answers
- Incorrect answers
- Percentage
- Time taken
- Explanations (if available)

Practice results are private to the participant.

---

# 12. APIs

Primary endpoints:

- `POST /practice/start`
- `POST /practice/submit`

Supporting APIs:

- `GET /question-banks/{id}`
- `POST /question-banks`

---

# 13. Database Usage

Tables involved:

- question_banks
- questions
- practice_sessions (recommended)
- practice_answers (recommended)
- users (optional)

---

# 14. Security

Validate:

- Uploaded content
- Input length
- Question Bank ownership (where applicable)
- File types
- Rate limits

Guests cannot access another user's saved Question Banks.

---

# 15. Error Handling

Handle:

- Unsupported file type
- AI provider failure
- Invalid topic
- Empty content
- Upload failure
- Session timeout
- Network interruption

Provide actionable, user-friendly messages.

---

# 16. Edge Cases

Examples:

- PDF with no extractable text
- Duplicate uploads
- Very large documents
- AI returns invalid JSON
- Browser refresh during practice
- Submission after timer expiration

---

# 17. Future Enhancements

- Resume practice
- Adaptive difficulty
- Personalized recommendations
- Streak tracking
- Practice analytics
- AI study plans

---

# 18. AI Implementation Rules

Every AI coding agent must:

- Reuse Question Banks whenever possible.
- Create a Practice Session for every attempt.
- Never mix practice data with assessment data.
- Preserve future extensibility.
- Follow documented APIs and workflows.

---

# 19. Acceptance Criteria

The feature is complete when:

- Topic practice works.
- PDF practice works.
- Notes practice works.
- Existing Question Banks are reused.
- New Question Banks are generated only when necessary.
- Results display correctly.
- No leaderboard entries are created.
- All validation and security rules pass.

---

# 20. Dependencies

Depends on:

- 00–10

Referenced by:

- 13_AI_CONTENT_PROCESSING.md
- 15_QUESTION_BANK.md
- 18_RESULTS_AND_HISTORY.md
