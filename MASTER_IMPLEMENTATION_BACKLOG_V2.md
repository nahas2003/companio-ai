# Master Implementation Backlog V2

This backlog maps out the engineering roadmap for the Companio platform to align with [`MASTER_PRODUCT_SPECIFICATION.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/MASTER_PRODUCT_SPECIFICATION.md), [`COMPANIO_SYSTEM_DESIGN.md`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/docs/COMPANIO_SYSTEM_DESIGN.md), and the approved architecture specifications.

---

## Completed Tasks

### Task 001: Assessment-First Homepage & Guest Entry

- **Task ID:** TASK-001
- **Status:** ✅ Completed
- **Objective:** Redesign the landing page layout to put assessments first, eliminate AI marketing terms, and support guest entries.
- **Description:** Completed landing page redesign featuring "Create Assessment" and "Join Assessment" actions. Integrated design token variables, subtle linear/radial background glows, realistic SaaS metrics, and a polished 5-column footer.

### Task 002: Guest Assessment Creation & Generation

- **Task ID:** TASK-002
- **Status:** ✅ Completed
- **Objective:** Allow guest users to configure assessment templates and generate questions without registration.
- **Description:** Removed AuthGuard blocks from `/generate` routes, mapped nullable guest session IDs, and exposed the question generation pipeline.

---

## Remaining Backlog

### Epic 1: Guest-First Evaluation Loop

#### Task 003: Guest Assessment Lobby & Profile Gate

- **Task ID:** TASK-003
- **Title:** Guest Assessment Lobby & Profile Gate
- **Objective:** Establish the entry gate and nickname profile collection for guest sessions.
- **Description:** Build the lobby view where candidates land after entering a valid 6-character room PIN. Collect candidate name, email, and display metadata before joining the test sequence.
- **User Story:** As an unauthenticated candidate, I want to join the proctored lobby using a room PIN and enter my nickname so that my attempts are tracked under my name.
- **Dependencies:** TASK-001, TASK-002
- **Files expected to change:**
  - `apps/web/app/assessments/join/page.tsx`
  - `apps/web/src/features/assessments/components/LobbyGate.tsx`
  - `apps/web/app/actions/assessments.ts`
- **Database impact:** Record new guest session parameters to `GuestSession` table.
- **Backend impact:** Create verification actions validating active room PINs.
- **Frontend impact:** Implement Lobby view featuring the candidate name form, validation displays, and access keys.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Join lobby using code `EF89A1`.
  - [ ] Confirm error messages display on invalid codes.
  - [ ] Verify guest profile records populate the DB on entry.
- **Acceptance criteria:** Candidate joins room using a code, submits screen name, and proceeds to the ready lobby.
- **Definition of Done:** TS compilation passes, ESLint matches rules, responsive layout works.
- **Estimated complexity:** Low

---

#### Task 004: Guest Proctored Examination View

- **Task ID:** TASK-004
- **Title:** Guest Proctored Examination View
- **Objective:** Build the proctored test-taking card layout with timer limits and tab-out protections.
- **Description:** Expose the dynamic test-taking route (`/assessments/take/[attemptId]`) to unauthenticated sessions. Implement proctor tracking (tab focus logs, blur listeners) and block page exit events.
- **User Story:** As a candidate, I want to take my assessment on a clean, timer-restricted interface that saves my progress so that I can complete the test fairly.
- **Dependencies:** TASK-003
- **Files expected to change:**
  - `apps/web/app/assessments/take/[attemptId]/page.tsx`
  - `apps/web/src/features/assessments/components/ExamSheet.tsx`
  - `apps/web/src/features/assessments/hooks/useProctor.ts`
- **Database impact:** None.
- **Backend impact:** Verify session access limits and map current attempt status.
- **Frontend impact:** Premium exam page displaying question navigation, option selections, countdown clock, and blur triggers.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Begin test attempt and verify countdown timer tick.
  - [ ] Confirm alert pops up if student switches browser tabs.
  - [ ] Confirm answers persist on connection drops.
- **Acceptance criteria:** Candidate takes test under proctored settings with questions displaying sequentially.
- **Definition of Done:** Proctor listeners verify successfully, countdown actions operate, package compiles.
- **Estimated complexity:** High

---

#### Task 005: Guest Grading Engine & Performance Reports

- **Task ID:** TASK-005
- **Title:** Guest Grading Engine & Performance Reports
- **Objective:** Compute candidate attempt scores and generate graded feedback summary views.
- **Description:** Expose results grading actions. Calculate percentage values, total correct answers, and aggregate attempt durations, then render performance reports detailing options analysis.
- **User Story:** As a candidate, I want to submit my test and immediately view my percentage score, accuracy distribution, and answer feedback.
- **Dependencies:** TASK-004
- **Files expected to change:**
  - `apps/web/app/actions/grading.ts`
  - `apps/web/app/assessments/results/[attemptId]/page.tsx`
  - `apps/web/src/features/assessments/components/ResultReport.tsx`
- **Database impact:** Populate scores, answers, and durations in `AssessmentAttempt`.
- **Backend impact:** Grade submissions against answer keys instantly.
- **Frontend impact:** Score summary view featuring accuracy indicators and question review cards.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Submit assessment sheets.
  - [ ] Check DB to ensure grading scores compute accurately.
  - [ ] Verify answer review lists show correct/incorrect highlights.
- **Acceptance criteria:** Submit test, view grade and answer reviews immediately.
- **Definition of Done:** Grade computations cover edge cases, Next.js build passes.
- **Estimated complexity:** Medium

---

#### Task 006: Guest Live Room Leaderboards

- **Task ID:** TASK-006
- **Title:** Guest Live Room Leaderboards
- **Objective:** Update and render candidate ranks and averages dynamically on room leaderboards.
- **Description:** Construct the leaderboard section displaying candidate ranking arrays, accuracy metrics, and time taken. Provide live score updates using polling or event channels.
- **User Story:** As a candidate, I want to view the room leaderboard to see how my score and time duration rank compared to other participants.
- **Dependencies:** TASK-005
- **Files expected to change:**
  - `apps/web/app/assessments/results/[attemptId]/leaderboard/page.tsx`
  - `apps/web/src/features/assessments/components/RoomLeaderboard.tsx`
- **Database impact:** Query rankings from `AssessmentAttempt` indexes.
- **Backend impact:** Expose rankings querying APIs.
- **Frontend impact:** Leaderboard UI displaying rank podiums and candidate tables.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Submit scores as multiple candidates.
  - [ ] Verify leaderboard updates ranking order correctly.
- **Acceptance criteria:** Displays correct ranks based first on accuracy score, then second on faster duration.
- **Definition of Done:** Leaderboard calculations function, layout passes linting.
- **Estimated complexity:** Medium

---

### Epic 2: Invisible AI Provider Architecture

#### Task 007: AI Provider Interface & Provider Registry

- **Task ID:** TASK-007
- **Title:** AI Provider Interface & Provider Registry
- **Objective:** Establish the common provider contract and database/config registry.
- **Description:** Define the `IAIProvider` TypeScript interface for unified completions generation. Create a registry configuration mapping provider properties (name, enabled, cost, rateLimits, priority).
- **User Story:** As a developer, I want a single interface contract and central registry, so that adding new AI model vendors doesn't require modifying application core code.
- **Dependencies:** TASK-006
- **Files expected to change:**
  - `apps/web/src/features/ai/interfaces/IAIProvider.ts`
  - `apps/web/src/features/ai/services/providerRegistry.ts`
  - `packages/db/prisma/schema.prisma`
- **Database impact:** Create `ProviderConfig` table for persistent provider attributes.
- **Backend impact:** Build registry managers querying active configurations.
- **Frontend impact:** None (runs silently).
- **AI impact:** Standardize prompt schema bindings.
- **Testing checklist:**
  - [ ] Register a new provider identifier.
  - [ ] Confirm active registry reads priority values cleanly.
- **Acceptance criteria:** Registry lists active systems and Priorities correctly.
- **Definition of Done:** Type definitions compile, database migration applies successfully.
- **Estimated complexity:** Medium

---

#### Task 008: Provider Factory & Vendor Adapters

- **Task ID:** TASK-008
- **Title:** Provider Factory & Vendor Adapters
- **Objective:** Build the provider factory class and implement modular vendor adapters.
- **Description:** Implement the `ProviderFactory` class resolving active instances. Build adapters implementing `IAIProvider` for: Mock, Gemini, NVIDIA, OpenAI, Claude, Azure OpenAI, and Ollama.
- **User Story:** As an operator, I want the system to dynamically instantiate the correct model adapter based on configuration, ensuring vendor independence.
- **Dependencies:** TASK-007
- **Files expected to change:**
  - `apps/web/src/features/ai/services/providerFactory.ts`
  - `apps/web/src/features/ai/adapters/GeminiAdapter.ts`
  - `apps/web/src/features/ai/adapters/OpenAIAdapter.ts`
  - `apps/web/src/features/ai/adapters/ClaudeAdapter.ts`
  - `apps/web/src/features/ai/adapters/NvidiaAdapter.ts`
  - `apps/web/src/features/ai/adapters/OllamaAdapter.ts`
  - `apps/web/src/features/ai/adapters/MockAdapter.ts`
- **Database impact:** None.
- **Backend impact:** Modular factory loading.
- **Frontend impact:** None.
- **AI impact:** Vendor-specific payload serialization and responses parsing.
- **Testing checklist:**
  - [ ] Request generation from OpenAI Adapter and Gemini Adapter.
  - [ ] Verify each adapter parses options arrays correctly.
- **Acceptance criteria:** Factory resolves and returns the configured adapter instance cleanly.
- **Definition of Done:** All adapters compile and implement `IAIProvider` correctly.
- **Estimated complexity:** High

---

#### Task 009: AI Provider Router & Failover Flow

- **Task ID:** TASK-009
- **Title:** AI Provider Router & Failover Flow
- **Objective:** Orchestrate failover logic that tries priority models and drops to fallbacks on failures.
- **Description:** Build the `AIProviderRouter`. Retrieve enabled models sorted by priority. Attempt generation with the top model. If an API key error, rate limit, or timeout occurs, catch it and try the next provider. Fall back to Mock if all fail.
- **User Story:** As a supervisor, I want the system to route requests to backup models when the main provider goes down, so that assessment generation never fails.
- **Dependencies:** TASK-008
- **Files expected to change:**
  - `apps/web/src/features/ai/services/providerRouter.ts`
  - `apps/web/app/actions/generation.ts`
- **Database impact:** Create fallback logging indicators.
- **Backend impact:** Core failover loop processing.
- **Frontend impact:** None.
- **AI impact:** Dynamic execution routing.
- **Testing checklist:**
  - [ ] Force a API timeout on the primary provider.
  - [ ] Verify the router catches it and successfully gets questions from the secondary provider.
  - [ ] Verify Mock acts as the final fail-safe.
- **Acceptance criteria:** Automated priority routing and failover completes in under 15 seconds.
- **Definition of Done:** Failover tests pass, Next.js build succeeds.
- **Estimated complexity:** High

---

#### Task 010: AI Metrics Logging & Cost Analytics

- **Task ID:** TASK-010
- **Title:** AI Metrics Logging & Cost Analytics
- **Objective:** Track and persist latency, token usage, and financial cost metrics per AI request.
- **Description:** Add hooks to record details of each routing request: response duration, prompt/completion token count, model identifier, success indicators, and computed cost.
- **User Story:** As an operator, I want to track token counts and cost indexes, so that I can audit model expenses over time.
- **Dependencies:** TASK-009
- **Files expected to change:**
  - `apps/web/src/features/ai/services/metricsCollector.ts`
  - `packages/db/prisma/schema.prisma`
- **Database impact:** Write log metrics to the `ProviderLogs` table.
- **Backend impact:** Interceptor middleware logging payload metrics.
- **Frontend impact:** None.
- **AI impact:** Read token metrics headers.
- **Testing checklist:**
  - [ ] Generate questions.
  - [ ] Check DB to ensure latency milliseconds and token indices populate accurately.
- **Acceptance criteria:** Logs save successfully with zero impact on request generation speed.
- **Definition of Done:** Logging is integrated, database migration committed.
- **Estimated complexity:** Medium

---

#### Task 011: Provider Health Monitoring & Circuit Breakers

- **Task ID:** TASK-011
- **Title:** Provider Health Monitoring & Circuit Breakers
- **Objective:** Automatically flag unhealthy providers and toggle status flags.
- **Description:** Implement a health monitor evaluating error rates. If a provider fails 3 consecutive requests, flag it as `unhealthy`, set an automated retry delay, and route around it.
- **User Story:** As an operator, I want the system to auto-isolate failing API endpoints, so that we don't waste time on failing servers.
- **Dependencies:** TASK-010
- **Files expected to change:**
  - `apps/web/src/features/ai/services/healthMonitor.ts`
  - `apps/web/src/features/ai/services/providerRegistry.ts`
- **Database impact:** Update status flags in `ProviderConfig`.
- **Backend impact:** Circuit breaker patterns matching config states.
- **Frontend impact:** None.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Trigger 3 consecutive errors on Gemini.
  - [ ] Confirm registry updates Gemini status to "disabled" or "unhealthy".
- **Acceptance criteria:** Unhealthy status switches instantly on threshold limits.
- **Definition of Done:** Circuit breaker verified by unit tests, build compiles.
- **Estimated complexity:** Medium

---

### Epic 3: Cost Optimization & Cache Engine

#### Task 012: Intelligent Request Hashing Cache

- **Task ID:** TASK-012
- **Title:** Intelligent Request Hashing Cache
- **Objective:** Cache generated assessment outputs using composite hashes of query properties.
- **Description:** Build the `IntelligentCache` system. Generate hashes from: topic, difficulty, quantity, question type, and language parameters. If the hash exists, return the cached questions immediately.
- **User Story:** As an operator, I want identical configuration requests to retrieve cached questions instantly, minimizing Gemini expenses.
- **Dependencies:** TASK-011
- **Files expected to change:**
  - `apps/web/src/features/ai/services/intelligentCache.ts`
  - `apps/web/app/actions/generation.ts`
  - `packages/db/prisma/schema.prisma`
- **Database impact:** Create `Cache` table with index on the `hash` key.
- **Backend impact:** Intercept generation requests with hash checks.
- **Frontend impact:** None (faster response).
- **AI impact:** Bypasses model invocation.
- **Testing checklist:**
  - [ ] Submit generation with exact parameters.
  - [ ] Confirm second run resolves in under 20ms using local cache.
- **Acceptance criteria:** Cache lookup resolves in under 50ms and prevents duplicates.
- **Definition of Done:** Cache migrations committed, queries typecheck, builds compile.
- **Estimated complexity:** High

---

#### Task 013: Question Pool Deduplication & Topic Reuse

- **Task ID:** TASK-013
- **Title:** Question Pool Deduplication & Topic Reuse
- **Objective:** Query the database for existing questions matching request topics before calling external AI APIs.
- **Description:** Implement keyword-matching logic inside generation pipelines. If existing questions matching the target topic are found, construct the assessment from the local database pool, querying AI only to top up if count < target.
- **User Story:** As the system administrator, I want to reuse generated questions for identical topics, so that I can reduce external API costs.
- **Dependencies:** TASK-012
- **Files expected to change:**
  - `apps/web/app/actions/generation.ts`
  - `apps/web/src/features/questions/services/poolManager.ts`
- **Database impact:** Add indices on the `topic` field in the `Question` model.
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

#### Task 014: Temporary Ingestion File Lifecycle & Storage Purging

- **Task ID:** TASK-014
- **Title:** Temporary Ingestion File Lifecycle & Storage Purging
- **Objective:** Extract study text documents, run virus scans, and delete file payloads post-parsing.
- **Description:** Implement a cleanup parser. Upload notes PDF/DOCX to Supabase temporary bucket. Scan for scripts/viruses, extract text strings, and run generation. Immediately purge storage payloads on completion callbacks.
- **User Story:** As an operator, I want uploaded study files to be deleted post-parsing, so that we don't maintain persistent file storage costs.
- **Dependencies:** TASK-013
- **Files expected to change:**
  - `apps/web/app/actions/sources.ts`
  - `apps/web/src/features/sources/services/storageCleaner.ts`
- **Database impact:** None.
- **Backend impact:** Storage bucket file deletions.
- **Frontend impact:** None.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Upload study text document.
  - [ ] Verify questions are generated.
  - [ ] Confirm the file is deleted from Supabase bucket.
- **Acceptance criteria:** Storage is freed immediately after text parser callbacks finish.
- **Definition of Done:** Storage cleanup actions verify successfully, codebase compiles.
- **Estimated complexity:** Medium

---

### Epic 4: Portal Cockpit & Organization Support

#### Task 015: User Portal Creator Dashboard

- **Task ID:** TASK-015
- **Title:** User Portal Creator Dashboard
- **Objective:** Build the dashboard panel listing created assessments, historical metrics, and candidates.
- **Description:** Build the dashboard interface. Display tables showing active room PINs, completion statistics, average scores, and candidate rosters. Support filtering and actions.
- **User Story:** As a supervisor, I want to view my dashboard so that I can check how many students completed my test and review score distributions.
- **Dependencies:** TASK-014
- **Files expected to change:**
  - `apps/web/app/(app)/dashboard/page.tsx`
  - `apps/web/src/features/dashboard/components/DashboardOverview.tsx`
- **Database impact:** None.
- **Backend impact:** Fetch queries aggregating attempt statistics.
- **Frontend impact:** Dashboard view containing statistics grids, assessment listings, and action sheets.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Load dashboard view.
  - [ ] Confirm listings display exact participant counts.
- **Acceptance criteria:** Aggregates and renders database metrics in under 300ms.
- **Definition of Done:** Portal page works, typechecks pass, responsive layouts verify.
- **Estimated complexity:** Medium

---

#### Task 016: Multi-Channel Notification Dispatcher

- **Task ID:** TASK-016
- **Title:** Multi-Channel Notification Dispatcher
- **Objective:** Implement the notifications delivery engine handling email logs and portal messages.
- **Description:** Build the notification dispatch engine. Support in-app bell messages, SMTP email delivery logs, preferences checkbox stores, and hourly/daily reminders cron schedulers.
- **User Story:** As a supervisor, I want to receive email updates when participants finish assessments, and manage my alerts in the header panel.
- **Dependencies:** TASK-015
- **Files expected to change:**
  - `apps/web/app/actions/notifications.ts`
  - `apps/web/src/components/Header.tsx`
  - `apps/web/src/features/notifications/services/dispatcher.ts`
- **Database impact:** None.
- **Backend impact:** Notification dispatch integrations.
- **Frontend impact:** Refined settings form toggles and notification items listing inside portal Header.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Generate a notification event.
  - [ ] Confirm message displays in header list.
  - [ ] Verify email delivery triggers.
- **Acceptance criteria:** Dispatches alerts to email/bell based on preference switches.
- **Definition of Done:** SMTP settings check out, list features compile cleanly.
- **Estimated complexity:** Medium

---

#### Task 017: Organization Support & Role-Based Access Control (RBAC)

- **Task ID:** TASK-017
- **Title:** Organization Support & Role-Based Access Control (RBAC)
- **Objective:** Configure organization mappings and assign user roles (Admin, Editor, Candidate).
- **Description:** Implement database organization relationships. Wrap portal actions in checks confirming the user is authorized for target organizations or resources.
- **User Story:** As an administrator, I want to manage my organization editors and limit candidate actions, so that my workspace data remains secure.
- **Dependencies:** TASK-016
- **Files expected to change:**
  - `apps/web/src/features/auth/utils/rbac.ts`
  - `apps/web/app/actions/admin.ts`
  - `packages/db/prisma/schema.prisma`
- **Database impact:** Add `Organization` and `UserOrganization` mapping schemas.
- **Backend impact:** Authorizations filter helpers.
- **Frontend impact:** Admin panel to manage company roles.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Try to access admin actions as a Candidate.
  - [ ] Verify unauthorized redirects.
- **Acceptance criteria:** Correctly redirects unauthorized sessions with code 403.
- **Definition of Done:** Authorization checks verify successfully, build compiles.
- **Estimated complexity:** High

---

### Epic 5: Quality Assurance, Accessibility & System Hardening

#### Task 018: Accessibility Audit & Keyboard Navigation

- **Task ID:** TASK-018
- **Title:** Accessibility Audit & Keyboard Navigation
- **Objective:** Ensure compliance with WCAG guidelines by structuring focus locks and ARIA labels.
- **Description:** Audit all custom design system inputs. Bind keyboard event listeners (`Escape` to close, `Tab` focus traps on Dialogs and Drawers), verify ARIA attributes, and validate color contrast.
- **User Story:** As a candidate with motor or visual impairments, I want to navigate the exam layout using my keyboard and screen reader, so that I can participate equally.
- **Dependencies:** TASK-017
- **Files expected to change:**
  - `packages/ui/src/components/Dialog.tsx`
  - `packages/ui/src/components/Drawer.tsx`
  - `packages/ui/src/components/Input.tsx`
  - `packages/ui/src/components/ThemeToggle.tsx`
- **Database impact:** None.
- **Backend impact:** None.
- **Frontend impact:** Accessible focus loops and labels.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Use Tab keys to cycle elements in a dialog modal.
  - [ ] Check console warnings for missing labels.
- **Acceptance criteria:** Tab cycles do not escape opened overlay dialogs.
- **Definition of Done:** A11y tests confirm compliance with accessibility rules, package compiles.
- **Estimated complexity:** Medium

---

#### Task 019: Automatic Guest Expiry & Cascade Deletes

- **Task ID:** TASK-019
- **Title:** Automatic Guest Expiry & Cascade Deletes
- **Objective:** Configure database cron cleanups to delete guest attempts older than 30 days.
- **Description:** Write db cleanup cron actions. Automatically delete attempts and logs without registered user links that are older than 30 days. Configure Prisma schema relation behaviors to execute cascade deletions.
- **User Story:** As an operator, I want guest test logs older than 30 days to be deleted automatically, so that database space remains optimized.
- **Dependencies:** TASK-018
- **Files expected to change:**
  - `packages/db/prisma/schema.prisma`
  - `apps/web/app/actions/admin.ts`
- **Database impact:** committed cascade delete constraints.
- **Backend impact:** Purging scripts.
- **Frontend impact:** Manual cleanup buttons in Admin options.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Confirm deleting an assessment attempt cascades and deletes option picks.
  - [ ] Verify cron deletes stale guest attempts cleanly.
- **Acceptance criteria:** Purges expired guest attempts cleanly without SQL constraints errors.
- **Definition of Done:** Deletions succeed, database package compiles.
- **Estimated complexity:** Low

---

#### Task 020: Performance Telemetry & Lighthouse Audits

- **Task ID:** TASK-020
- **Title:** Performance Telemetry & Lighthouse Audits
- **Objective:** Track web vitals (FCP, LCP) and optimize client-side bundle configurations.
- **Description:** Integrate FCP telemetry tracking. Optimize Next.js bundle sizes, lazy-load dialog overlays, check file sizes, and verify Lighthouse metrics targets.
- **User Story:** As an operator, I want page load times to stay low, so that candidates on low-bandwidth networks have a fast experience.
- **Dependencies:** TASK-019
- **Files expected to change:**
  - `apps/web/app/layout.tsx`
  - `apps/web/next.config.js`
- **Database impact:** None.
- **Backend impact:** None.
- **Frontend impact:** Optimized asset sizes.
- **AI impact:** None.
- **Testing checklist:**
  - [ ] Run Lighthouse audit.
  - [ ] Confirm Performance and Accessibility scores are above 90.
- **Acceptance criteria:** Landing page FCP is under 1.5 seconds.
- **Definition of Done:** Telemetry is active, webpack configs are verified, builds compile cleanly.
- **Estimated complexity:** Medium
