# Master Implementation Backlog

This backlog maps out the engineering roadmap for the Companio platform to align with [`MASTER_PRODUCT_SPECIFICATION.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/MASTER_PRODUCT_SPECIFICATION.md) and [`COMPANIO_SYSTEM_DESIGN.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/COMPANIO_SYSTEM_DESIGN.md).

---

## Completed Tasks

### Task 001: Assessment-First Homepage & Guest Entry

- **Status:** ✅ Completed
- **Changes:** Rewrote the entry route to sport a clean, white-background theme, positioned "Create Assessment" and "Join Assessment" as primary buttons, and removed all AI/Gemini marketing copy.

---

## Epic 1: Guest First Workflow

### Task 002: Guest Assessment Creation & Generation

- **Task ID:** TASK-002
- **Title:** Guest Assessment Creation & Generation
- **Objective:** Allow guest users to create assessments and generate question cards without registering or logging in.
- **User Story:** As an unauthenticated guest visitor, I want to create an assessment from a topic, description, or notes upload, so that I can immediately share it with participants.
- **Functional Requirements:**
  - Expose `/generate` route to guest sessions.
  - Modify question generation actions to accept guest identifiers.
  - Create assessment template records with a `null` userId constraint.
- **Non-functional Requirements:**
  - Creation request processing duration must be under 30 seconds.
- **Dependencies:** Task 001
- **Files Expected to Change:**
  - `apps/web/app/generate/page.tsx`
  - `apps/web/app/actions/generation.ts`
  - `apps/web/src/features/auth/components/AuthGuard.tsx`
- **Database Changes:** Allow `userId` to be nullable in Prisma schemas for `Assessment` and `Source` tables.
- **API Changes:** Update `generateQuestionsAction` to handle optional authentication tokens.
- **UI Changes:** Remove AuthGuard wrapping on `/generate` route, showing guest limits notifications.
- **AI Changes:** None.
- **Testing Requirements:** Verify guest creations generate 6-digit invitation access keys and database records correctly.
- **Acceptance Criteria:** A guest clicks "Create Assessment", enters a topic, generates questions, receives a code, and joins it successfully without auth errors.
- **Definition of Done:** Next.js build compiles successfully, typechecks pass, and guest creation flows are verified.
- **Estimated Complexity:** Medium

---

## Epic 2: Invisible AI Interface Polish

### Task 003: UI/UX Audit & AI Brand Removal

- **Task ID:** TASK-003
- **Title:** UI/UX Audit & AI Brand Removal
- **Objective:** Remove all visible AI branding, model selectors, robot icons, and "Powered by AI" tags across dashboard panels.
- **User Story:** As an assessment creator, I want a clean interface focused strictly on assessment metrics, without being distracted by model configurations or AI tags.
- **Functional Requirements:**
  - Remove provider selection dropdowns and tokens diagnostics from user dashboards.
  - Replace sparkles icons and AI terminology with "Automated Builder" and "Question Generator".
- **Non-functional Requirements:**
  - Design must adhere to a minimal white-background theme.
- **Dependencies:** Task 002
- **Files Expected to Change:**
  - `apps/web/app/(app)/dashboard/page.tsx`
  - `apps/web/app/(app)/admin/page.tsx`
  - `apps/web/src/components/Sidebar.tsx`
- **Database Changes:** None.
- **API Changes:** None.
- **UI Changes:** Clean dashboard grids, removing AI provider selections and token charts.
- **AI Changes:** None.
- **Testing Requirements:** Visual regression verification of all dashboards and admin tabs.
- **Acceptance Criteria:** No user-facing page contains "Gemini", "AI-powered", or sparkles/robot icons.
- **Definition of Done:** Codebase is free of AI branding, builds compile, and ESLint checks pass.
- **Estimated Complexity:** Low

---

## Epic 3: Cost Optimization & Cache Engine

### Task 004: Topic-Based Question Pool Reuse & Caching

- **Task ID:** TASK-004
- **Title:** Topic-Based Question Pool Reuse & Caching
- **Objective:** Search the database and reuse existing questions matching the requested topic before calling external AI APIs.
- **User Story:** As the platform operator, I want to reuse generated questions for identical topics, so that I can minimize Gemini API usage and costs.
- **Functional Requirements:**
  - Create a keyword-matching query on the `Question` table.
  - If a topic has >= N questions, pull them from the database instead of calling the AI.
- **Non-functional Requirements:**
  - Cache lookup latency must be under 100ms.
- **Dependencies:** Task 003
- **Files Expected to Change:**
  - `apps/web/app/actions/generation.ts`
  - `apps/web/app/actions/practice.ts`
- **Database Changes:** Add indices on the `topic` field in the `Question` model.
- **API Changes:** Update generation server actions to run cache verification queries first.
- **UI Changes:** None.
- **AI Changes:** Call the AI provider only when local pool questions count is insufficient.
- **Testing Requirements:** Verify that creating two assessments on the same topic reuses questions and doesn't fire duplicate AI requests.
- **Acceptance Criteria:** Local question pool records are reused successfully for repeat topic creation requests.
- **Definition of Done:** Caching workflow is active, builds compile, and tests pass.
- **Estimated Complexity:** High

---

### Task 005: File Ingestion Storage Cleanup

- **Task ID:** TASK-005
- **Title:** File Ingestion Storage Cleanup
- **Objective:** Delete uploaded document files from Supabase storage buckets immediately after parsing text content.
- **User Story:** As the platform operator, I want uploaded study files to be deleted post-processing, so that I can minimize persistent S3 storage costs.
- **Functional Requirements:**
  - Trigger storage bucket deletion APIs immediately after text content is extracted.
  - Maintain only database text metadata records.
- **Non-functional Requirements:**
  - Storage deletion calls must execute asynchronously without blocking the user.
- **Dependencies:** Task 004
- **Files Expected to Change:**
  - `apps/web/app/actions/sources.ts`
- **Database Changes:** None.
- **API Changes:** None.
- **UI Changes:** None.
- **AI Changes:** None.
- **Testing Requirements:** Verify files are deleted from the Supabase bucket once question generation completes.
- **Acceptance Criteria:** Source files are removed from storage buckets post-extraction.
- **Definition of Done:** Storage space is freed post-upload, builds compile, and linters pass.
- **Estimated Complexity:** Medium

---

## Epic 4: Data Retention & Cleanup Policies

### Task 006: Guest Records Automatic Expiry

- **Task ID:** TASK-006
- **Title:** Guest Records Automatic Expiry
- **Objective:** Automatically purge old guest assessment attempts and sessions to maintain database health.
- **User Story:** As the platform operator, I want to clean up guest attempts older than 30 days, so that database space remains optimized.
- **Functional Requirements:**
  - Create a cleanup action in the database layer.
  - Automatically query and delete attempts without registered user links.
- **Non-functional Requirements:**
  - Purging must execute during off-peak hours.
- **Dependencies:** Task 005
- **Files Expected to Change:**
  - `packages/db/prisma/schema.prisma`
  - `apps/web/app/actions/admin.ts`
- **Database Changes:** Cascade deletes on guest attempt dependencies.
- **API Changes:** Add a manual/automated purge trigger in Admin actions.
- **UI Changes:** Add "Purge Guest Logs" button inside Admin Diagnostics tab.
- **AI Changes:** None.
- **Testing Requirements:** Verify database records are deleted without breaking related foreign keys.
- **Acceptance Criteria:** Guest attempts older than the configuration threshold are deleted cleanly.
- **Definition of Done:** Cleanups are verified, builds pass, and all tasks compile.
- **Estimated Complexity:** Low
