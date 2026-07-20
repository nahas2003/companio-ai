# Current Project State

This document provides a comprehensive audit of the current project state, based directly on the actual codebase implementation as of July 20, 2026.

---

## 1. Project Overview

- **Current Development Phase:** MVP Phase (Core Ingestion, AI Generation, and Question Bank repository completed).
- **Overall Completion Percentage (Estimated):** 55%
- **Last Analyzed Date:** July 20, 2026

---

## 2. Technology Stack

- **Frontend:** Next.js 14.2.3 (App Router, React 18, TypeScript)
- **Backend:** Next.js Server Actions (Decoupled from standard REST endpoint routers)
- **Database:** PostgreSQL (Hosted on Supabase, Pgbouncer transaction pooler enabled)
- **ORM:** Prisma Client ORM (v5.22.0)
- **Authentication:** Supabase Auth (`@supabase/supabase-js` client SDK integration)
- **State Management:** Zustand (v4.5.2 client-side auth store)
- **AI Provider:** Google Generative AI (`@google/generative-ai` SDK) & Mock Provider Adapter
- **Styling:** Vanilla CSS, Tailwind CSS (v3.4.3), Lucide React Icons (v0.378.0)
- **File Storage:** Supabase Storage (Private storage bucket named `"sources"`)
- **Package Manager:** Monorepo managed using `pnpm` workspaces (v10.6.4)

---

## 3. Folder Structure Summary

- `/apps/web`: Next.js web application. Contains routes (`app/`), Server Actions (`app/actions/`), and module features (`src/features/` representing Auth, AI, Dashboard, Profile, and Sources components).
- `/packages/db`: Core database module. Holds schema declarations (`prisma/schema.prisma`) and exports the Prisma Client.
- `/packages/ui`: Shareable design tokens and core component variables (exports `Button` and `cn` Tailwind merger helper).
- `/packages/tsconfig`: Shared TypeScript configuration configurations.
- `/docs`: Architecture specifications, task lists, and operational guides.

---

## 4. Implemented Features

- **Authentication:** ✅ Completed  
  Custom login and registration portals hooked to Supabase Auth. Session tokens are synchronized to Next.js components using a Zustand-backed client store.
- **User Profile:** ✅ Completed  
  Supports updating display names. Keeps track of authentication roles.
- **Dashboard:** 🚧 Partial  
  Displays learning statistics grids and activity lists, currently backed by a mocked service layer (`dashboardService.ts`).
- **Study Material Ingestion:** ✅ Completed  
  File upload drop zone streams binaries directly to Supabase storage. Supports text extraction from PDF, DOCX, TXT, and MD files using `pdf-parse` and `mammoth` parser packages.
- **AI Question Generation:** ✅ Completed  
  Configures question formats (Multiple Choice, True/False, Short Answer) and difficulty levels. Generates questions through the AI Orchestrator and performs Zod validation checks and title duplicate removals.
- **Question Bank:** ✅ Completed  
  Centralized repository featuring paginated list grids, search inputs, type/difficulty filters, active/archived status tabs, edit dialog modals, and bulk operations.
- **Practice Mode:** ❌ Not Started  
  Specifications are defined, but interactive practice sessions, response storage tables, score counters, and gameplay engines are not yet implemented.
- **Assessment:** ❌ Not Started  
  No engines or evaluation modules implemented.
- **Analytics:** ❌ Not Started
- **Admin Portal:** 🚧 Partial  
  Exposes user role modification forms, active AI provider configs, and execution diagnostics tests.

---

## 5. Implemented Pages

| Route            | Page Name               | Status       | Notes                                                                                          |
| :--------------- | :---------------------- | :----------- | :--------------------------------------------------------------------------------------------- |
| `/`              | Landing page            | ✅ Completed | Entry page prompting users to sign in.                                                         |
| `/login`         | Sign In Portal          | ✅ Completed | Sign-in form guarded by `GuestGuard`.                                                          |
| `/register`      | Sign Up Portal          | ✅ Completed | Sign-up form automatically creating database profiles.                                         |
| `/dashboard`     | Student Dashboard       | ✅ Completed | Metrics dashboard cards. Uses mock `dashboardService`.                                         |
| `/sources`       | Material Catalog        | ✅ Completed | streaming Zone files upload list, processing triggers, rename, and delete actions.             |
| `/generate`      | Practice Builder        | ✅ Completed | Option sliders to compile MCQ/TF/Short Answers. Shows preview with interactive reveal toggles. |
| `/question-bank` | Question repository     | ✅ Completed | Search dashboard, filters, bulk operations, and inline editors.                                |
| `/admin`         | Administration Terminal | ✅ Completed | Role update forms, configuration states, and diagnostics.                                      |
| `/profile`       | Profile settings        | ✅ Completed | Form to edit user display names.                                                               |
| `/unauthorized`  | 403 Forbidden           | ✅ Completed | Unauthorized fallback view.                                                                    |

---

## 6. Implemented Components

- **`Button`** (`@companio/ui`): Reusable styling button.
- **`AuthGuard`** (`src/features/auth/components/AuthGuard.tsx`): Guards protected route groups client-side.
- **`GuestGuard`** (`src/features/auth/components/GuestGuard.tsx`): Guards registration and login flows.
- **`RoleGuard`** (`src/features/auth/components/RoleGuard.tsx`): Renders components based on permissions.
- **`Header`** & **`Sidebar`**: Layout panels displaying collapsed controls and mobile toggles.
- **`UploadZone`** (`src/features/sources/components/UploadZone.tsx`): streams files directly to storage.
- **`SourceList`** (`src/features/sources/components/SourceList.tsx`): Displays processing badges and renames/deletes.
- **`AiSystemDiagnostics`** (`app/(app)/admin/page.tsx`): Runs diagnostics checks and displays usage logs.

---

## 7. API Status (Next.js Server Actions)

All database mutations and verified communications are handled through Server Actions:

| Route / Module            | Action Name                   | Method (Implicit) | Purpose                                               | Status    |
| :------------------------ | :---------------------------- | :---------------- | :---------------------------------------------------- | :-------- |
| `actions/auth.ts`         | `syncUser`                    | POST counterpart  | Syncs Supabase user credentials to PostgreSQL         | ✅ Active |
| `actions/profile.ts`      | `getUserProfile`              | GET counterpart   | Fetches user info from PostgreSQL                     | ✅ Active |
| `actions/profile.ts`      | `updateUserProfile`           | POST counterpart  | Updates display name                                  | ✅ Active |
| `actions/profile.ts`      | `updateUserRole`              | POST counterpart  | Admins can update roles                               | ✅ Active |
| `actions/sources.ts`      | `getSources`                  | GET counterpart   | Lists user's uploaded materials                       | ✅ Active |
| `actions/sources.ts`      | `renameSource`                | POST counterpart  | Renames material                                      | ✅ Active |
| `actions/sources.ts`      | `deleteSource`                | POST counterpart  | Deletes from DB and Supabase storage                  | ✅ Active |
| `actions/sources.ts`      | `processDocument`             | POST counterpart  | Downloads file from Storage, parses text, and upserts | ✅ Active |
| `actions/ai.ts`           | `getAiSystemStatus`           | GET counterpart   | Aggregates database usage logs and latency metrics    | ✅ Active |
| `actions/ai.ts`           | `testAiExecution`             | POST counterpart  | Runs diagnostics loopback check                       | ✅ Active |
| `actions/generation.ts`   | `generateQuestionsAction`     | POST counterpart  | Generates questions from parsed text using AI         | ✅ Active |
| `actions/questionBank.ts` | `saveQuestionsToBankAction`   | POST counterpart  | Persists generated questions in transaction           | ✅ Active |
| `actions/questionBank.ts` | `getQuestionsAction`          | GET counterpart   | Filters, searches, and paginates questions            | ✅ Active |
| `actions/questionBank.ts` | `updateQuestionAction`        | POST counterpart  | Modifies question details                             | ✅ Active |
| `actions/questionBank.ts` | `toggleArchiveQuestionAction` | POST counterpart  | Toggles archived status                               | ✅ Active |
| `actions/questionBank.ts` | `softDeleteQuestionAction`    | POST counterpart  | Soft deletes question (sets deleted = true)           | ✅ Active |
| `actions/questionBank.ts` | `bulkActionQuestionsAction`   | POST counterpart  | Bulk archive/restore/delete in transaction            | ✅ Active |

---

## 8. Database Status

- **Existing Tables:**
  - `User`: User profile table (`role` enum `Role`).
  - `Source`: Ingested study material files metadata with index on `userId` (`status` is backed by `SourceStatus` Enum).
  - `DocumentContent`: raw extracted plain text block (1-to-1 cascading relation to `Source`).
  - `AiUsageLog`: Stores providers, model, latency, success rates, with index on `userId`.
  - `QuestionBank`: permanent named collections of questions, with indexes on `userId` and `sourceId`.
  - `Question`: Question details mapping 1-to-many relationship with `QuestionBank`, with index on `questionBankId`. `type` is backed by `QuestionType` Enum, `difficulty` by `Difficulty` Enum.
- **Database Sync:**
  - Synchronized and verified using `prisma db push` on Supabase PostgreSQL. Initial migration baseline folder structure created.
- **Missing Tables:**
  - `PracticeSession`, `UserResponse` (for Practice Mode).
  - `AssessmentTemplate`, `AssessmentSession`, `AssessmentResult` (for Assessments).

---

## 9. Authorization & Protected Routes Status

- **Login & Registration:** Supabase client authentication handles auth tokens.
- **Syncing profiles:** Client-side triggers `syncUser`. Additionally, **centralized server-side auto-provisioning** (`authUtils.ts`) lazy-syncs missing profiles from Supabase to PostgreSQL on-the-fly during any Server Action. This eliminates the risk of orphaned user accounts.
- **Role-Based Access Control:** Predefined permissions list (`auth/utils/rbac.ts`) maps roles (STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN) to capabilities:
  - Guarded client-side by `<RoleGuard requiredPermission="...">`.
  - Guarded server-side inside Actions (`updateUserRole`, `getAiSystemStatus`, `testAiExecution`) by validating requester role credentials in the database.
- **Protected Routes:** React App group `(app)/` is wrapped inside the client-side `<AuthGuard>` which redirects anonymous sessions to `/login`.

---

## 10. AI Integration Status

- **Provider Integrated:** Google Generative AI (Gemini v1.5 API wrapper).
- **API SDK:** `@google/generative-ai` package interface.
- **Fallback Adapter:** `MockProviderAdapter` automatically takes over during development when `GEMINI_API_KEY` is not present, maintaining sandbox validity.
- **Prompt Registry:** `promptRegistry.ts` centralizes template versions and formats. Variables (e.g. `{{documentText}}`) are dynamically compiled.
- **Orchestrator Pipeline:** `aiOrchestrator.ts` executes prompts under safety conditions:
  - **Timeout Protection:** Requests are raced against a 30-second timeout limit.
  - **Retry Logic:** Transient errors are retried up to 3 times with exponential backoff.
  - **Response Validation:** Zod schemas validate the returned JSON array structure depending on format (MCQ, True/False, Short Answer).
  - **History logs:** Every action records metrics (duration, error messages, tokens) inside `AiUsageLog`.
- **Current Limitations:** No semantic caching (every generation queries the provider API), no token cost estimator.

---

## 11. Environment Variables

Below are the variables declared in the environment configs:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project database link.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client anon keys.
- `DATABASE_URL`: Prisma connection pooling connection string (port `6543`).
- `DIRECT_URL`: Prisma database connection string for migrations (port `5432`).
- `GEMINI_API_KEY`: API key for Gemini API (if empty, Mock fallback is used).

---

## 12. Current UI Progress

- **Dashboard:** Complete layout shell displaying collapsible sidebar, breadcrumbs, loading states, and stats grid. Stats grid uses hardcoded statistics.
- **Study Ingestion:** Complete upload zone with drag-and-drop triggers, private Storage bucket streaming, live state badges, delete, and rename dialogs.
- **AI Quiz Builder:** Complete parameter panels (type, difficulty, range slider) and preview lists featuring reveal option triggers.
- **Question Bank:** Complete management terminal with paginated grids, bulk controls, and edit modal popup panels.
- **Admin Portal:** Active diagnostics terminal displaying averages, config statuses, and live request log items.

---

## 13. Testing Status

- **Unit & Integration tests:** ❌ None Configured (no Jest, Vitest, Cypress, or Playwright packages exist in configurations).
- **Validation Strategy:** Relies entirely on Next.js typescript check compilation (`pnpm build`) and manual review loops.

---

## 14. Known Issues & Tech Debt

- **Client-Side User Synchronization Risk:** ✅ **Resolved.** Mitigated completely via server-side lazy-provisioning during action execution.
- **Mock Statistics:** User dashboard statistics (Accuracy, answered questions) use mock responses from `dashboardService.ts`.
- **Direct Database Syncing:** Baseline migrations are tracked locally, synced via `prisma db push` due to non-interactive environment limits.
- **Large Files text Ingestion limits:** ✅ **Mitigated.** Enforced maximum file size limits (10MB) check in Server Actions before parsing.

---

## 15. Performance & Security Review

- **Performance:** Text parser utilities run inside server actions. 10MB size limits check prevents extremely large uploads.
- **Security & Auth:** Centralized authentication (`authUtils.ts`) enforces validation server-side. **Sliding window rate limiters** protect ingestion (`processDocument`) and generation (`generateQuestionsAction`) from quota exhaustion. SQL transactions (`$transaction`) are utilized to ensure database integrity.
- **Storage Rules:** Supabase storage bucket `"sources"` is private and restricted.
- **SQL Injection Safety:** Prisma Client query builders are utilized for database interactions, ensuring safety against SQL injection.

---

## 16. Next Development Priorities

1. **Practice Mode Engine (Task 012):** Implement tables (`PracticeSession`, `UserResponse`), build active question session loops, save user accuracy scores, and sync stats to dashboard widgets.
2. **Assessment Delivery (Task 013/014):** Build assessment templates, configure timers, and implement assessment delivery engines.
3. **Analytics (Task 015/016):** Create progress analytics, result trackers, and charts.
4. **Migration Audit:** Run `prisma migrate dev` to establish database migration baselines.

---

## 17. Overall Assessment

- **Strengths:** Robust AI orchestrator pipeline (handling retries, timeouts, and Zod validations), clean monorepo architecture, and high-fidelity responsive user interface.
- **Weaknesses:** Complete lack of automated unit tests and hardcoded stats in dashboard logs.
- **Estimated Completion Percentage:** 55%
- **Production Readiness Score:** 65/100 (Rate limiting, buffer constraints, user profile auto-syncing, database enums, and index optimizations implemented).
