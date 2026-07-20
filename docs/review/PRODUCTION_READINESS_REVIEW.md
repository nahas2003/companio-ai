# Production Readiness Review

This document provides a comprehensive code review and production readiness audit of the current Companio AI implementation. It outlines architectural gaps, security concerns, performance risks, and database optimization recommendations that must be addressed before proceeding with production release or implementing downstream learning features.

---

## 1. Architecture Review

- **Separation of Concerns:**
  - The Server Actions (e.g., `processDocument` in `actions/sources.ts` and `generateQuestionsAction` in `actions/generation.ts`) carry multiple responsibilities: downloading files from storage, parsing format binaries, calling orchestrators, running Zod schema checks, and persisting data. This violates the Single Responsibility Principle (SRP).
  - _Recommendation:_ Move business-heavy orchestrations into separate service classes (e.g., `DocumentIngestionService`, `QuizGenerationService`) and keep Server Actions as lightweight request/response handlers.
- **Dependency Inversion Principle (DIP):**
  - The `aiOrchestrator.ts` lazily resolves adapters by instantiating adapter instances directly (`new GeminiProviderAdapter(...)`, `new MockProviderAdapter()`). This couples the orchestrator to concrete classes.
  - _Recommendation:_ Use a factory pattern or dependency injector to supply the orchestrator with active adapters.
- **Code Duplication:**
  - Session retrieval and JWT verification (`getVerifiedUserId`) are duplicated file-by-file across multiple actions (`sources.ts`, `ai.ts`, `generation.ts`, `questionBank.ts`).
  - _Recommendation:_ Consolidate JWT verification into a shared helper function in an auth utility file.
- **Reusability:**
  - Modals (e.g., save deck dialog, edit question dialog, delete confirm panels) are coded inline within pages, duplicating backdrop overlays and click handlers.
  - _Recommendation:_ Move these overlays into reusable modal components inside `packages/ui`.

---

## 2. Database Review

- **Data Integrity & Constraints:**
  - Columns like `Source.status`, `Question.type`, and `Question.difficulty` are declared as plain strings rather than database-level Enums. This exposes the database to spelling mistakes or corrupt data entries.
  - _Recommendation:_ Convert these to PostgreSQL Enums (`Status`, `QuestionType`, `Difficulty`) within the Prisma schema.
- **Missing Database Indexes:**
  - The schema does not define indexes on foreign keys, which will cause slow sequential table scans as records multiply.
  - _Recommendation:_ Add the following indexes to `schema.prisma`:
    - `Source`: index on `userId` (`@@index([userId])`).
    - `QuestionBank`: index on `userId` and `sourceId`.
    - `Question`: index on `questionBankId`.
    - `AiUsageLog`: index on `userId` and `promptName`.
- **Prisma Schema Sync vs. Migrations:**
  - Development currently relies on `prisma db push`, which alters database schemas directly without recording SQL migration scripts. This makes environments drift over time and prevents safe schema rollbacks.
  - _Recommendation:_ Establish a migration baseline using `prisma migrate dev` before deploying to staging/production.

---

## 3. AI Ingestion Pipeline Review

- **Hardcoded Prompt Templates:**
  - Prompt templates are stored as static strings inside code files (`promptRegistry.ts`). Tuning prompts requires redeploying the Next.js server.
  - _Recommendation:_ Keep templates in a database table (`PromptTemplate`) to support runtime editing and prompt A/B testing.
- **Retry Jitter:**
  - The orchestrator retry logic uses exponential backoff (`Math.pow(2, attempt) * 500`) but does not apply randomized "jitter." During transient provider outages, concurrent requests will retry in lockstep, risking API rate-limit starvation.
  - _Recommendation:_ Add a random offset (jitter) to the backoff duration.
- **Caching Opportunities:**
  - Generating questions from the same text block with the same settings executes repeated calls to the Gemini API. This incurs significant token costs and latency.
  - _Recommendation:_ Implement a key-value cache (e.g., using Redis) hashing `sourceId + type + difficulty + count` to immediately return previous results.

---

## 4. Security Review

- **Client-Side Auth Token Dependency:**
  - Server Actions accept the client Zustand store's `accessToken` to retrieve sessions. While functional, this relies on client cooperation.
  - _Recommendation:_ Transition session management to HttpOnly session cookies verified by Next.js middleware.
- **File Upload Vulnerabilities:**
  - Files are validated on the client side by extension, but the server action `processDocument` downloads the raw buffer from Storage without verifying magic numbers (MIME-type validation) or enforcing file-size limits. A malicious user could bypass client controls to upload massive files, leading to a Denial of Service (DoS) attack.
  - _Recommendation:_ Enforce strict byte-size limits (e.g., max 10MB) and validate file headers during ingestion.
- **XSS Risks:**
  - Plain text parsed contents are saved raw in `DocumentContent` and output in preview fields.
  - _Recommendation:_ Ensure appropriate sanitization before rendering AI outputs or extracted text.
- **Missing Rate Limiting:**
  - There are no rate limiters on AI generation or document parsing actions. A malicious user could flood the Server Actions to inflate your Gemini API bill.
  - _Recommendation:_ Implement rate-limiting middleware (e.g., token bucket algorithm) on all AI endpoints.

---

## 5. Performance Review

- **Memory Exhaustion on Large Files:**
  - Parsers (`pdf-parse`, `mammoth`) buffer files entirely in server memory. Parsing a 50MB textbook or slide pack will spike memory usage, potentially crashing serverless instances (e.g., Vercel Serverless Functions) with Out-Of-Memory (OOM) errors.
  - _Recommendation:_ Implement stream-based chunk parsing or delegate file processing to asynchronous background workers (e.g., BullMQ, Ingest).
- **React Render Cycles:**
  - In `/question-bank` and `/generate`, searching, checking boxes, or opening inline modals triggers parent component re-renders.
  - _Recommendation:_ Memoize child elements and apply debouncing (e.g., 300ms) to search inputs to limit execution cascades.
- **Server Action Latency:**
  - Parsing and generating questions are synchronous blockages. A user waiting for a 15-question generation experiences a blank loading spinner for up to 25 seconds.
  - _Recommendation:_ Transition generation to asynchronous tasks that update client states via polling or server-sent events (SSE).

---

## 6. UI/UX & Accessibility Review

- **Accessibility (a11y):**
  - Custom sliders, selector buttons, and accordion panels lack screen reader descriptions (`aria-label`, `aria-expanded`).
  - _Recommendation:_ Audit interactive components for WCAG compliance.
- **Responsive Visual Scopes:**
  - The bulk operations bar and complex tables collapse on mobile screens, causing text truncation.
  - _Recommendation:_ Implement card grid layouts for small screens rather than traditional HTML tables.

---

## 7. Code Quality

- **Hardcoded Model Names & Timeouts:**
  - The model name `gemini-1.5-flash` is hardcoded in the adapter, and the 30-second timeout is hardcoded in `aiOrchestrator.ts`.
  - _Recommendation:_ Move these configurations into server-side environment variables or configuration constants.
- **User Synchronization Vulnerability:**
  - The `syncUser` action is invoked by a client-side callback upon successful Supabase sign-up. If the user closes the browser tab before the callback fires, their profile is never created in PostgreSQL, preventing future logins.
  - _Recommendation:_ Use a Supabase Database Webhook trigger to automatically sync profiles at the database level during auth sign-up events.

---

## 8. Production Readiness Action Items

### 🚨 Critical Issues (Must Fix Before Downstream Features)

1. **User Profile Syncing:** Refactor `syncUser` to use Supabase database webhooks rather than client-side callbacks to prevent orphaned accounts.
2. **AI Rate Limiting:** Implement rate limiters on `generateQuestionsAction` and `processDocument` to prevent quota exhaustion.
3. **Database Migrations:** Generate baseline migrations (`prisma migrate dev`) and deploy them to align Supabase PostgreSQL schemas.
4. **Buffer Size Constraints:** Enforce file size limits (e.g., maximum 10MB) in `processDocument` to prevent server crashes.

### 🟡 High Priority Improvements

1. **Database Indexes:** Add indexes on `userId` and relation foreign keys in `schema.prisma`.
2. **Convert Strings to Enums:** Change `status`, `type`, and `difficulty` fields to PostgreSQL Enums.
3. **Centralize Auth Verification:** Remove duplicated token verification logic from actions and place it in a shared auth helper file.

### 🔵 Medium Priority Improvements

1. **Prompt Caching:** Implement an AI caching layer (e.g., Redis) to prevent duplicate generation charges.
2. **Extract Modals:** Refactor inline question editors and confirmation dialogs into reusable `<Modal>` components.
3. **Model Name Constants:** Move AI models and timeout limits to env configurations.

### 🟢 Low Priority Improvements

1. **Retry Jitter:** Apply random offsets (jitter) to orchestrator retry intervals.
2. **Responsive Mobile layouts:** Convert question bank tables to card lists on mobile views.
