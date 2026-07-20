# Master Implementation Backlog

This backlog maps out the engineering roadmap for the Companio platform to align with [`MASTER_PRODUCT_SPECIFICATION.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/MASTER_PRODUCT_SPECIFICATION.md) and [`COMPANIO_SYSTEM_DESIGN.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/COMPANIO_SYSTEM_DESIGN.md).

---

## Completed Tasks

### Task 001: Assessment-First Homepage & Guest Entry

- **Task ID:** TASK-001
- **Status:** ✅ Completed and Approved
- **Objective:** Redesign homepage to put assessments first, remove AI branding, and support guest logins.
- **Description:** Updated landing page to focus on "Create Assessment" and "Join Assessment" primary actions. Replaced sparkles and robots with clean SaaS metrics and polished layouts.

### Task 002: Guest Assessment Creation & Generation

- **Task ID:** TASK-002
- **Status:** ✅ Completed and Approved
- **Objective:** Allow guests to configure assessments and generate questions without registration.
- **Description:** Exposed generation pipelines, enabled nullable foreign keys for anonymous session IDs, and removed AuthGuard blocks from configuration pages.

---

## Remaining Backlog

### Epic 1: Guest-First Evaluation Loop

#### Task 003: Guest Assessment Taking & Proctored Lobby

- **Task ID:** TASK-003
- **Title:** Guest Assessment Taking & Proctored Lobby
- **Objective:** Build the taking interface and lobby matching code access queries for unregistered sessions.
- **Description:** Expose the dynamic test taking layout (/assessments/take/[attemptId]) to unauthenticated guest rooms. Verify room codes, support active timers, and disable keyboard exit shortcuts.
- **User Story:** As an unauthenticated candidate, I want to paste a 6-character room PIN on the landing page and join the assessment session instantly so that I can begin answering questions.
- **Dependencies:** TASK-001, TASK-002
- **Files expected to change:**
  - `apps/web/app/assessments/take/[attemptId]/page.tsx`
  - `apps/web/src/features/auth/components/AuthGuard.tsx`
  - `apps/web/app/actions/assessments.ts`
- **Database impact:** None.
- **Backend impact:** Update session validation helper endpoints to allow guest credentials.
- **Frontend impact:** Create a mock Candidate Profile entry window (for names/emails input) inside the room landing gate before the test starts.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Join room using code `EF89A1` as a guest.
  - [ ] Enter a screen name.
  - [ ] Verify questions render in sequence.
  - [ ] Ensure back button browser exits are caught.
- **Acceptance criteria:** Candidate enters code, inputs nickname, views questions, and answers them without auth redirects.
- **Definition of Done:** TypeScript builds pass, ESLint compiles cleanly, and responsive mobile taking layout is verified.
- **Estimated complexity:** Medium

---

#### Task 004: Guest Anonymous Grading & Real-Time Leaderboard

- **Task ID:** TASK-004
- **Title:** Guest Anonymous Grading & Real-Time Leaderboard
- **Objective:** Save attempts score matrices and update relative leaderboards for guest candidate sessions.
- **Description:** Expose the results submission action. Score responses dynamically, compute accuracies, log completion duration, and update the session leaderboard lobby.
- **User Story:** As a candidate, I want to submit my final answers and view my results and class leaderboard rank instantly so that I can track my speed and performance.
- **Dependencies:** TASK-003
- **Files expected to change:**
  - `apps/web/app/actions/grading.ts`
  - `apps/web/app/assessments/results/[attemptId]/page.tsx`
  - `apps/web/src/components/Leaderboard.tsx`
- **Database impact:** Record submissions to `AssessmentAttempt` table mapping guest keys.
- **Backend impact:** Calculate score statistics and ranking arrays immediately on submission.
- **Frontend impact:** Show score badges, correct/incorrect review grids, and rank podium elements.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Complete attempt answers and click submit.
  - [ ] Verify database record contains accurate score calculations.
  - [ ] Confirm leaderboard lists the new candidate rank correctly.
- **Acceptance criteria:** Submit test, view grade and rank within 2 seconds.
- **Definition of Done:** Submission actions pass typechecks, database logs match scores, and layout is verified.
- **Estimated complexity:** Medium

---

### Epic 2: Invisible AI Polish & Quality Control

#### Task 005: AI Branding Removal & Clean UX Audit

- **Task ID:** TASK-005
- **Title:** AI Branding Removal & Clean UX Audit
- **Objective:** Scrub all remaining provider selections, sparkles, token stats, and raw model config panels from dashboard views.
- **Description:** Inspect portal dashboards, source upload screens, and settings panels. Replace sparkles/robot logos with document and outline indicators. Rename copy terms from "AI Assistant" to "Automated Builder".
- **User Story:** As an organizer, I want a clean dashboard that functions without visible AI selectors, so that I can focus entirely on standard assessment tasks.
- **Dependencies:** TASK-004
- **Files expected to change:**
  - `apps/web/app/(app)/dashboard/page.tsx`
  - `apps/web/app/(app)/sources/page.tsx`
  - `apps/web/src/components/Sidebar.tsx`
  - `apps/web/src/components/Header.tsx`
- **Database impact:** None.
- **Backend impact:** None.
- **Frontend impact:** Clean, professional surface layouts displaying neutral SaaS copy.
- **AI impact:** None (AI runs silently behind the scenes).
- **Testing checklist:**
  - [ ] Search the codebase for terms "Gemini", "AI-powered", and "robot".
  - [ ] Confirm model selection dropdowns are deleted.
- **Acceptance criteria:** Codebase is free of user-facing AI branding.
- **Definition of Done:** Visual review completed, lint rules pass, build builds successfully.
- **Estimated complexity:** Low

---

#### Task 006: Automated Background Question Quality Auditing

- **Task ID:** TASK-006
- **Title:** Automated Background Question Quality Auditing
- **Objective:** Add automated background audits to flag and discard duplicate, invalid, or malformed questions.
- **Description:** Implement a backend validator that evaluates generated JSON payloads. Check for invalid options formatting, missing answers, and repetitive semantic patterns before saving to the bank.
- **User Story:** As an educator, I want the system to filter out corrupt or duplicate questions automatically, so that my generated assessments are highly reliable.
- **Dependencies:** TASK-005
- **Files expected to change:**
  - `apps/web/app/actions/generation.ts`
  - `apps/web/src/features/questions/utils/validator.ts`
- **Database impact:** None.
- **Backend impact:** Create validation handlers checking schemas and duplicate strings.
- **Frontend impact:** None (validation runs automatically).
- **AI impact:** Enhance system instructions to ensure Gemini outputs structure-validated content.
- **Testing checklist:**
  - [ ] Feed generation with malformed JSON mock payloads.
  - [ ] Confirm the system catches structure errors and fails gracefully.
- **Acceptance criteria:** Malformed questions are discarded or corrected automatically.
- **Definition of Done:** Validator module is fully integrated, verified by tests, and compiles cleanly.
- **Estimated complexity:** Medium

---

### Epic 3: Cost Optimization & Cache Engine

#### Task 007: Topic-Based Question Pool Reuse & Deduplication

- **Task ID:** TASK-007
- **Title:** Topic-Based Question Pool Reuse & Deduplication
- **Objective:** Query the database for existing questions matching request topics before calling external AI APIs.
- **Description:** Build keyword-matching algorithms in the generation actions. If existing questions matching the target topic are found, compile the assessment from the local pool instead of triggering Gemini calls.
- **User Story:** As the system administrator, I want to reuse generated questions for identical topics, so that I can reduce external API costs.
- **Dependencies:** TASK-006
- **Files expected to change:**
  - `apps/web/app/actions/generation.ts`
  - `apps/web/src/features/questions/services/cache.ts`
- **Database impact:** Add performance indexes on the `topic` field in the `Question` model.
- **Backend impact:** Implement local question extraction queries.
- **Frontend impact:** None.
- **AI impact:** AI is bypassed if existing question counts satisfy request parameters.
- **Testing checklist:**
  - [ ] Create assessment for "SQL Basics".
  - [ ] Create a second assessment for "SQL Basics" and check that the AI call count is zero.
- **Acceptance criteria:** Bypasses Gemini API when >= 10 matching questions are cached in the database.
- **Definition of Done:** Caching query logic is active, verified by mock test cases, and compiles.
- **Estimated complexity:** High

---

#### Task 008: Immediate File Storage Purging Lifecycle

- **Task ID:** TASK-008
- **Title:** Immediate File Storage Purging Lifecycle
- **Objective:** Delete source document files from Supabase storage buckets post-parsing.
- **Description:** Implement storage delete actions inside the upload pipeline. Once study document text extraction is complete, trigger API requests to remove the files from Supabase bucket storage, keeping only the database text metadata.
- **User Story:** As the platform operator, I want uploaded PDF files to be deleted after text parsing is complete, to avoid unnecessary persistent storage fees.
- **Dependencies:** TASK-007
- **Files expected to change:**
  - `apps/web/app/actions/sources.ts`
  - `apps/web/src/features/sources/services/storage.ts`
- **Database impact:** None.
- **Backend impact:** Call Supabase bucket deletion APIs on post-parsing callbacks.
- **Frontend impact:** None.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Upload a PDF document.
  - [ ] Confirm text is parsed and questions generate.
  - [ ] Check Supabase bucket to confirm the PDF is deleted.
- **Acceptance criteria:** S3/Supabase storage is freed immediately after text parser callbacks finish.
- **Definition of Done:** Storage space is freed post-upload, builds compile, and linters pass.
- **Estimated complexity:** Medium

---

### Epic 4: Data Retention & Cleanup Policies

#### Task 009: Guest Data Retention Policies & Automatic Expiry

- **Task ID:** TASK-009
- **Title:** Guest Data Retention Policies & Automatic Expiry
- **Objective:** Set up cron jobs or automatic processes to delete guest sessions and attempts older than 30 days.
- **Description:** Add a scheduled script in the database layer. Regularly query `AssessmentAttempt` records without associated user accounts, verify age > 30 days, and delete them along with response details.
- **User Story:** As the database administrator, I want to purge stale guest attempts older than 30 days, so that database storage remains clean.
- **Dependencies:** TASK-008
- **Files expected to change:**
  - `packages/db/prisma/schema.prisma`
  - `apps/web/app/actions/admin.ts`
- **Database impact:** Add cascade delete parameters on `AssessmentAttempt` relations.
- **Backend impact:** Implement background database cleaning query actions.
- **Frontend impact:** Add a manually triggerable "Purge Guest Logs" button in Admin Diagnostics.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Set database records timestamps to > 30 days ago.
  - [ ] Trigger cleanup script.
  - [ ] Confirm stale guest records are deleted.
- **Acceptance criteria:** Automatically delete guest attempts older than 30 days.
- **Definition of Done:** Cleanups are verified, builds pass, and all tasks compile.
- **Estimated complexity:** Medium

---

#### Task 010: Database Indexes & Performance Hardening

- **Task ID:** TASK-010
- **Title:** Database Indexes & Performance Hardening
- **Objective:** Add performance indexes and query optimizations to ensure excellent dashboard loading speeds.
- **Description:** Run database optimization review. Add composite indexes on foreign keys (`userId`, `assessmentId`) and topic query targets.
- **User Story:** As a supervisor, I want dashboard metrics to render instantly, so that I can inspect class attempts without delay.
- **Dependencies:** TASK-009
- **Files expected to change:**
  - `packages/db/prisma/schema.prisma`
- **Database impact:** Update index configurations and migration outputs.
- **Backend impact:** Optimize query parameters to utilize indexes.
- **Frontend impact:** None (faster load speeds).
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Verify schema migrations apply successfully.
  - [ ] Profile dashboard queries to confirm they utilize indexed keys.
- **Acceptance criteria:** Dashboard query retrieval duration is consistently under 50ms.
- **Definition of Done:** Database migrations are committed, verified, and package builds cleanly.
- **Estimated complexity:** Medium
