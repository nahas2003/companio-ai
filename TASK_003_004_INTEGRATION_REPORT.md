# Task 003 & 004 Integration Report

This integration report documents the end-to-end verification of the Guest Assessment Flow, combining the Lobby Gate (`TASK-003`) and the Proctored Take View (`TASK-004`).

---

## 1. Verified Integration Flow

| Flow Stage / Step                   | Result    | Verification Details                                                                                                                                                                                                                   |
| :---------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Room PIN Verification**        | 🟢 Passed | Entering a valid 6-character room PIN resolves the active published assessment template, fetching details (timer limit, question counts, title) with zero authentication prompts.                                                      |
| **2. Nickname Ingestion**           | 🟢 Passed | Guest candidate inputs a participant screen nickname, satisfying client-side validation rules.                                                                                                                                         |
| **3. Exam Navigation**              | 🟢 Passed | Clicking the action trigger creates an anonymous `AssessmentAttempt` row inside the PostgreSQL database (mapping the participant name to `guestName` and setting `userId` to `NULL`) and redirects to `/assessments/take/[attemptId]`. |
| **4. Focused Layout Render**        | 🟢 Passed | The exam canvas loads inside the isolated `(exam)` route group layout. All sidebar navigation menus and global header links are hidden to ensure focus.                                                                                |
| **5. Proctor Timer Countdown**      | 🟢 Passed | A countdown clock initiates immediately based on the template's duration limit, displaying in standard `MM:SS` format.                                                                                                                 |
| **6. Focus Switches Detection**     | 🟢 Passed | Switching tabs or closing browser focus fires window `blur` events. An alert warning banner displays at the top of the question card showing the running incident log count.                                                           |
| **7. Refresh blocker Alert**        | 🟢 Passed | Refreshing the screen or navigating backwards triggers browser exit popups (`beforeunload` handler) while the attempt remains in `IN_PROGRESS` status.                                                                                 |
| **8. Attempt Evaluation Submit**    | 🟢 Passed | Submitting answers successfully scores responses, flags status as `COMPLETED`, records timestamps, and stops the proctoring hook hooks.                                                                                                |
| **9. Proctoring Deactivation**      | 🟢 Passed | Once evaluation finishes, window event listeners are completely cleaned up and detached, and the page leave prompts are deactivated.                                                                                                   |
| **10. Console / Network Stability** | 🟢 Passed | Bypassed authentication redirects successfully. Zero console runtime faults or network asset failures logged.                                                                                                                          |

---

## 2. Decoupled Proctoring Hook Specifications

The reusable `useProctoring` React hook provides a pure behavioral event engine, exposing:

- `blurCount`: Focus loss events counter.
- `isFocused`: Flag indicating if the candidate is focusing on the window.
- `warningMessage`: Dynamic warning text logs.
- `clearWarning`: Callback to dismiss alerts.
- **Extensibility slots:** Empty stub hooks mapped to `startFullscreen`, `stopFullscreen`, `isWebcamActive`, and `isClipboardAccessGranted` to facilitate future feature additions.

---

## 3. Codebase Diagnostics & Build Success

- **TypeScript compilation status:** `tsc --noEmit` completed with **zero errors**.
- **Next.js compilation status:** `next build` compiled all routes cleanly with **zero optimization failures**.
- **Dev Server Status:** The client development server is running in the background and serving pages correctly on local port `3000`.
