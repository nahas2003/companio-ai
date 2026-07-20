# Runtime Validation Report

This report documents the runtime validation audit completed for the Companio AI platform as of July 20, 2026.

---

## 1. Features Tested & Validation Outcomes

We executed verification flows across every major module on the local development server:

| Module / Feature              | Flow Tested                                                                                                    | Actual Runtime Behavior                                                                                                                                  | Status    |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- |
| **1. Authentication**         | Sign up, login, profile lazy-provision, session verification, guard redirects.                                 | Supabase Auth processes credentials. `RegisterForm` detects verification states and prompts user check email popups. Dashboard lazily inserts SQL users. | ✅ Passed |
| **2. Dashboard**              | Aggregate metrics, study statistics widgets, feed log streams.                                                 | Queries database tables via `getDashboardDataAction`. Computes live accuracy levels and active sessions count with zero mock dependencies.               | ✅ Passed |
| **3. Study Materials**        | Listing sources, deletion, rename, text extraction triggers.                                                   | Displays uploaded catalog tables. Bypasses extraction if size exceeds 10MB bounds.                                                                       | ✅ Passed |
| **4. AI Question Generation** | Builder parameters compile, Gemini API latency timeouts, schema Zod parsing.                                   | Generates questions matching difficulty level filters. Runs mock backup retries if API fails.                                                            | ✅ Passed |
| **5. Question Bank**          | Repositories search, bulk deletions, edit dialog inputs.                                                       | Paginated grid updates inline edits. Uses database `$transaction` for bulk status alterations.                                                           | ✅ Passed |
| **6. Practice Sessions**      | Filter launcher, resume dialog, playable slide navigation, timed score summaries.                              | Detects active `IN_PROGRESS` sessions. Playground populates previous responses. Computes correct choice averages upon submission.                        | ✅ Passed |
| **7. Assessments**            | Create template, publish 6-digit access code, guest joining entrance, proctored timer bounds, scoring reports. | Generates codes. Exam sheet timer calculates secure elapsed boundaries from SQL starting points (bulletproof on browser refresh).                        | ✅ Passed |
| **8. Notifications**          | Dropdown bell alerts drawer, unread counter badge, mark-read, delete action, preference setting checkbox.      | Bell icon displays unread badges count. Allows toggling email logs and in-app alerts inside settings tab.                                                | ✅ Passed |
| **9. Administration**         | Tabs navigation (Users Directory, System Settings, AI settings, Storage rules, Audit trail logs).              | Restricts entry to admin roles. Modifies user roles, deactivates profiles, saves config preferences, and renders audit history table.                    | ✅ Passed |
| **10. File Uploads**          | Drag and drop upload stream, Supabase private bucket storage connection.                                       | Streams file byte payloads directly to storage bucket name `"sources"`.                                                                                  | ✅ Passed |
| **11. AI Provider Config**    | Switch provider (Gemini / Mock adapter), override default models, configure retry parameters.                  | Settings form stores preferences in database, dynamically affecting generation adapters routing.                                                         | ✅ Passed |
| **12. RBAC Guarding**         | Route paths middleware guards, permission checks.                                                              | central `RoleGuard` blocks student access to admin workspaces and template builders.                                                                     | ✅ Passed |

---

## 2. Bugs Fixed & Resolved

1. **Next.js Client Environment Resolution:**
   - _Bug:_ Browser client threw `"supabaseUrl is required."` error.
   - _Fix:_ Copied root `.env` and `.env.local` configuration files inside `apps/web/` so Next.js runtime compile is able to resolve the Supabase public API endpoints correctly.
2. **Registration Email Verification UX:**
   - _Bug:_ Signing up with email verification enabled redirected to the dashboard, which booted the unconfirmed user back to the login screen.
   - _Fix:_ Updated `RegisterForm.tsx` to inspect signup session response. If confirmation link is pending, it displays a beautiful verify-email card instructing them to check their inbox.
3. **Missing Icon Reference:**
   - _Bug:_ Header.tsx build failed with `Cannot find name 'RefreshCw'` icon error.
   - _Fix:_ Added `RefreshCw` inside the `lucide-react` import statement list inside `Header.tsx`.

---

## 3. Remaining Known Issues

- **None:** No critical blockers or unhandled exceptions are present in the core workflows.

---

## 4. Recommendations

1. **Automate QA Suites:** Implement Vitest unit specs and Playwright E2E browser scripts to test the student and proctored guest workflows automatically.
2. **CDN Compression:** Set up custom headers or asset caching mechanisms to optimize heavy file downloads latency.
