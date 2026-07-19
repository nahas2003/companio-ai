# 006_DASHBOARD.md

> **Project:** Companio
> **Task ID:** 006
> **Task Name:** Dashboard
> **Priority:** High
> **Estimated Complexity:** Medium

---

# 1. Purpose

Implement the main dashboard for authenticated users.

The dashboard is the first screen users see after signing in. It should provide a clear overview of their activity and quick access to the platform's primary features.

The dashboard should be informative without overwhelming the user.

---

# 2. User Story

**As a user, I want to see my learning progress and quickly access important actions so that I can continue studying without unnecessary navigation.**

---

# 3. Objective

At the end of this task, authenticated users should be able to:

* View a personalized dashboard.
* Access major platform features.
* See learning statistics.
* Continue recent activities.
* View recent assessments and practice sessions.

---

# 4. MVP Implementation

Implement:

### Dashboard Layout

* Welcome section
* User greeting
* Quick action cards

### Statistics

* Practice sessions completed
* Assessments completed
* Questions answered
* Overall accuracy

### Recent Activity

* Recent uploads
* Recent practice sessions
* Recent assessments

### Quick Actions

* Upload Learning Material
* Start Practice
* Create Assessment (Admin)
* View Question Bank
* View Results

---

# 5. Future Enhancements

Future versions may include:

* AI recommendations
* Learning streaks
* Weekly progress
* Study goals
* Calendar
* Team dashboards
* Gamification
* Achievement badges
* Personalized widgets

---

# 6. Out of Scope

Do **not** implement:

* AI generation
* Upload processing
* Practice functionality
* Assessment logic
* Results calculations

Use placeholder or mock data where dependent modules are not yet available.

---

# 7. Required Reading

## Architecture

* Dashboard architecture document
* Master Project Specification
* System Architecture
* Project Constitution

## Development

* Coding Standards
* Performance Guidelines
* Error Handling
* AI Agent Workflow

---

# 8. Prerequisites

Complete:

* 001 Project Setup
* 002 Authentication
* 003 User Profile
* 004 RBAC
* 005 App Layout

---

# 9. Files Allowed to Modify

The AI may modify:

* Dashboard pages
* Dashboard components
* Dashboard services
* Dashboard hooks
* Shared dashboard UI
* Dashboard routes

---

# 10. Files Not to Modify

Do **not** implement:

* Upload module
* AI module
* Question Bank
* Practice module
* Assessment module
* Results module

Use mock data until those modules are completed.

---

# 11. Frontend Tasks

Implement:

* Dashboard page
* Statistics cards
* Quick actions
* Activity feed
* Empty states
* Loading states
* Responsive dashboard

---

# 12. Backend Tasks

Implement only:

* Dashboard data service
* Statistics aggregation
* Recent activity retrieval

Avoid business logic belonging to later tasks.

---

# 13. Database Changes

No major schema changes expected.

If additional dashboard views or helper queries are needed, keep them isolated and documented.

---

# 14. AI Implementation Rules

The AI must:

* Keep dashboard components modular.
* Separate presentation from data retrieval.
* Handle missing data gracefully.
* Avoid implementing unfinished modules.
* Use placeholders where appropriate.

---

# 15. Implementation Checklist

* Dashboard page created
* Statistics cards implemented
* Quick actions added
* Recent activity section added
* Responsive layout verified
* Loading states implemented
* Empty states implemented

---

# 16. Testing Checklist

Verify:

* Dashboard loads after login.
* Statistics display correctly.
* Quick actions navigate correctly.
* Empty state appears when no activity exists.
* Responsive layout works across devices.
* Unauthorized users cannot access the dashboard.

---

# 17. Acceptance Criteria

The task is complete when:

* Authenticated users reach the dashboard after login.
* Dashboard renders without errors.
* Statistics and recent activity display correctly.
* Quick actions are functional.
* The implementation follows project standards.

---

# 18. Definition of Done

The dashboard is complete when:

* Core widgets are implemented.
* Navigation is functional.
* Placeholder integrations are ready for future modules.
* Tests pass.
* Documentation remains consistent.

---

# 19. Deliverables

Expected outputs:

* Dashboard page
* Dashboard components
* Statistics widgets
* Activity feed
* Quick action cards
* Dashboard services
* Supporting tests

---

# 20. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the dashboard.

Do not implement Upload, AI Processing, Question Bank, Practice, or Assessment functionality.

Use placeholder data where dependent modules are not yet available.

Follow project coding standards, security checklist, and AI workflow.

Run all applicable validation and tests.

Provide a summary of changes, modified files, and testing results.

---

# 21. Next Task

Proceed to:

**007_SOURCE_UPLOAD.md**
