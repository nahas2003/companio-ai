# Changelog

All notable changes to the Companio AI project will be documented in this file.

## [v0.2.0] - 2026-07-20

### Added

- **Practice Playroom:**
  - Added new sidebar navigation item `Practice Zone` linking to `/practice`.
  - Added interactive card-based gameplay layout with progress bars, slideshow page state variables, and optional proctored countdown timers.
  - Implemented immediate results dashboard showing score gauges and answer keys comparisons.
- **Assessment Exam Engine:**
  - Added creator templates workspace dashboard at `/assessments`.
  - Implemented 6-letter unique alphanumeric code generation for publishes.
  - Added invitation code joining page `/assessments/join` supporting student auth context soft-resolving and guest participant input tags.
  - Developed full exam sheets taking views `/assessments/take/[attemptId]` implementing proctored timer bounds counting down elapsed time from start database columns.
  - Built student results summary banners and instructor attempts grade report lists.
- **Live SQL Analytics Dashboard:**
  - Added live analytics server action `getDashboardDataAction` fetching completed metrics directly from Postgres.
  - Hooked `/dashboard` widgets to show live Accuracy, Questions Answered, and study activity stream feeds.
- **Notifications & Communication Center:**
  - Added in-app notification center inbox drawer layout inside main layout header page.
  - Implemented badge overlays displaying total unread alerts counts.
  - Developed custom settings preferences tab checking or disabling email alerts logs and in-app bell counters.
  - Integrated welcome auto-sync alerts triggers and assessment complete/published event subscribers.
- **Administration & settings Workspace:**
  - Developed full-scale admin portal dashboard with dedicated tabs layout.
  - Built Users Directory supporting searches, role filters, account deactivations, and password reset triggers.
  - Implemented System Preferences, AI configuration panels (Active provider models and timeout gates), and Storage constraints settings.
  - Created operational auditing trail tracking logs linked to database `AdminAuditLog` events.

### Changed

- Refactored `apps/web/src/components/Sidebar.tsx` to unlock active links to practice and assessment directories, removing obsolete mock condition blocks.

### Fixed

- Fixed typescript length checking constraints inside `/assessments` page states.
