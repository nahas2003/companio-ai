# Architecture Review Report

This report evaluates the Companio system architecture against the specifications in [`MASTER_PRODUCT_SPECIFICATION.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/MASTER_PRODUCT_SPECIFICATION.md) and [`COMPANIO_SYSTEM_DESIGN.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/COMPANIO_SYSTEM_DESIGN.md).

---

## 1. Executive Summary

The current Next.js monorepo architecture is a strong foundation for an assessment platform. However, to transition to a production-grade platform that aligns with the "Invisible AI" and "Guest First" principles, several core gaps must be addressed.

Implementing a reusable question pool caching engine and removing mandatory registration for core features will reduce operational costs and friction.

---

## 2. Comprehensive Module Evaluation

### 1. Overall System Architecture

- **Evaluation:** Next.js App Router + Server Actions + Supabase PostgreSQL via Prisma. Suitable for performance and rapid deployment.
- **Suitability:** High. Server Actions reduce API latency and simplify queries.

### 2. AI Provider Architecture

- **Evaluation:** The specification requests a prioritized router factory supporting multiple vendors (Gemini, Claude, OpenAI, NVIDIA). Currently, it's a hardcoded check checking `process.env.GEMINI_API_KEY` before falling back to Mock.
- **Weakness:** Lack of registry patterns or database settings checking.
- **Recommendation:** Hook `aiOrchestrator.ts` to query `SystemSetting` table configurations.

### 3. Intelligent Cache Strategy

- **Evaluation:** No cache layer is currently active. Every test request invokes the AI provider.
- **Weakness:** High operational costs and slow load times.
- **Recommendation:** Implement a cache mapping hash keys of (topic + description + difficulty + quantity) to stored question sets.

### 4. Question Pool Strategy

- **Evaluation:** The system does not support bulk generation (100 Easy/Medium/Hard) or question reuse across assessments.
- **Weakness:** Redundant AI calls.
- **Recommendation:** Create a `QuestionPool` relational mapping and query match algorithms.

### 5. Guest Workflow

- **Evaluation:** Currently, guest users cannot create assessments or generate questions without logging in.
- **Weakness:** Violates the "Guest First" principle.
- **Recommendation:** Refactor `/generate` and `/assessments` pages to allow creation processes without checking auth sessions.

### 6. Authentication Architecture

- **Evaluation:** Mapped via Supabase Auth.
- **Suitability:** High. Supports lazy profile insertion.

### 7. Database Architecture

- **Evaluation:** Relational keys and indexes are set up correctly.
- **Suitability:** High. Matches schema requirements.

### 8. File Ingestion Lifecycle

- **Evaluation:** Uploaded documents are currently stored permanently in private buckets instead of being deleted post-extraction.
- **Weakness:** Unnecessary S3 storage charges.
- **Recommendation:** Call a storage bucket delete method immediately after question generation is completed.

---

## 3. Core Weaknesses & Architectural Impact

### Weakness 1: Mandatory Authentication for Question Generation

- **Why it is a weakness:** Prevents guest users from experiencing the core product flow immediately upon landing.
- **Recommended Design:** Remove authorization guards from page routes. Pass a `session.userId` parameter to actions only if logged in; otherwise, assign the assessment to a `null` user.
- **Impact of changing it now vs later:**
  - _Now:_ Low impact. Easy to modify guards.
  - _Later:_ High impact. Requires refactoring database cascades and relational joins.

### Weakness 2: Missing Question Cache/Pool Reuse

- **Why it is a weakness:** Triggers duplicate Gemini API calls for identical topics, increasing operational costs.
- **Recommended Design:** Introduce a search query on the `Question` table to find matching topics. If enough questions exist, pull them from the database instead of calling the AI.
- **Impact of changing it now vs later:**
  - _Now:_ Medium impact. Simple caching logic updates.
  - _Later:_ High impact. Under scale, high API costs could occur.

### Weakness 3: Permanent Source File Storage

- **Why it is a weakness:** Storing notes permanently increases storage costs.
- **Recommended Design:** Implement a delete step inside the document ingestion server action immediately after parsing text.
- **Impact of changing it now vs later:**
  - _Now:_ Low impact. Simple function call.
  - _Later:_ Medium impact. Requires cleaning up large amounts of legacy files.
