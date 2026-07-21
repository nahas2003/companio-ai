# Assessment Delivery & Candidate Experience (v1.2) QA Report

## 1. Accessibility (a11y) Verification

- **Keyboard Navigating**: Focus indicators move correctly across MCQ options and textarea inputs. Pressing `Left Arrow` / `Right Arrow` navigates questions.
- **Screen Reader Compatibility**: Input elements utilize explicit labels (`aria-label`) and semantic HTML.
- **Focus Indicators**: Button selections feature solid focus rings (`focus-visible:ring-2`).

---

## 2. Security Audits

- **Authentication Guard**: Unauthenticated guests must input a display name before joining assessments. Server actions validate session context or guest authority.
- **Prevention of Duplicate Submissions**: Attempt status validation prevents submitting or altering completed/expired attempts.
- **Timer Safeguards**: Client-side countdown is cosmetic; the server evaluates attempt expiry against `expiresAt`.

---

## 3. UI/UX Responsiveness & Layout Checks

- **Responsive Viewports**: Tested rendering on mobile, tablet, and widescreen monitors.
- **Fullscreen Layout**: Fullscreen styling fits 100vh perfectly, avoiding double scrolls or truncated buttons.
- **Dark/Light/System Themes**: Global stylesheet renders custom properties correctly in dark and light modes.
