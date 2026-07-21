# Assessment Delivery & Candidate Experience (v1.2) Implementation Report

## 1. Overview
The v1.2 updates introduce a premium, server-authoritative, and resilient candidate exam delivery experience. The workflow prevents client-side timer manipulation, supports live auto-saves, seamlessly resumes interrupted exams, and introduces Multiple Select graded options.

---

## 2. Architecture & Database Schema Changes

### Enum Updates
- Added `MULTIPLE_SELECT` option to `QuestionType` representing checkbox question types.
- Created `AttemptStatus` enum to manage lifecycle:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `SUBMITTED`
  - `EXPIRED`
  - `ABANDONED`

### Model Updates
- **AssessmentAttempt**:
  - `status`: Migrated from `String` to type-safe `AttemptStatus` enum.
  - `expiresAt`: Added `DateTime?` storing absolute server expiration time.
  - `currentQuestionId`: Added `String?` tracking last active question index.
- **AssessmentResponse**:
  - `markedForReview`: Added `Boolean` tracking review state flag.

---

## 3. Key Features Completed

### Server-Authoritative Timer & Expiry
- When starting an attempt, `expiresAt` is calculated as `startedAt + timer * 60s`.
- On loading attempt details via `getAssessmentAttemptAction`, if `expiresAt` has passed and the attempt is still `IN_PROGRESS`, the server auto-completes and grades the attempt.

### Resilient Auto-Saves & Resume
- Every option select, checkbox toggle, or text entry immediately invokes `saveAssessmentResponseAction` in the background.
- Saves display live status indicator states: `Saving...`, `Saved`, `Offline`, or `Reconnecting`.
- If a candidate refreshes or loses connection, reloading retrieves existing responses, restoring answers, timer, current question index, and marked-for-review status.

### Multiple Select Grading logic
- Gradings serialize answers as JSON lists (`"[0, 2]"`).
- Evaluator compares sorting matches order-independently to calculate correct answers.
- Review view shows correct/incorrect choice highlights for both single and multiple-select questions.
