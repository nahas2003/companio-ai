# 005_APP_LAYOUT_AND_NAVIGATION.md

> **Project:** Companio
> **Task ID:** 005
> **Task Name:** Application Layout & Navigation
> **Priority:** High
> **Estimated Complexity:** Medium

---

# 1. Purpose

Build the shared application shell used throughout Companio.

This task creates the structural foundation that all authenticated pages will use, ensuring a consistent user experience across the application.

---

# 2. Objective

At the end of this task:

- Authenticated users access a unified application layout.
- Navigation is consistent across all pages.
- Protected routes render within the application shell.
- Responsive behavior works across desktop, tablet, and mobile.
- Theme support is established.

---

# 3. MVP Implementation

Implement:

- Global application layout
- Header
- Sidebar (collapsible)
- Main content area
- Breadcrumb support
- Responsive navigation
- Active navigation highlighting
- Loading indicators
- Error boundary
- 404 page
- Unauthorized page integration

---

# 4. Future Enhancements

May include later:

- Multiple layout variants
- Workspace switching
- Organization selector
- Command palette
- Keyboard shortcuts
- Customizable dashboards
- Advanced navigation personalization

---

# 5. Out of Scope

Do **not** implement:

- Dashboard widgets
- AI processing
- Source upload
- Question Bank
- Practice Mode
- Assessment features
- Notifications
- Reports

Only build the shared layout and navigation framework.

---

# 6. Required Reading

## Architecture

- 00_MASTER_PROJECT_SPECIFICATION.md
- 01_SYSTEM_ARCHITECTURE.md
- Navigation/Layout architecture documents
- 21_PROJECT_CONSTITUTION.md

## Development

- 16_CODING_STANDARDS.md
- 19_ERROR_HANDLING.md
- 21_PERFORMANCE_GUIDELINES.md
- 24_AI_AGENT_WORKFLOW.md

---

# 7. Prerequisites

Complete:

- 001_PROJECT_SETUP.md
- 002_AUTHENTICATION.md
- 003_USER_PROFILE.md
- 004_RBAC.md

Verify:

- Authentication works.
- Authorization is operational.
- User profile loads successfully.

---

# 8. Files Allowed to Modify

The AI may modify:

- Layout components
- Navigation components
- Shared UI components
- Routing configuration
- Theme configuration
- Global styles (where required)
- Error boundary components

---

# 9. Files Not to Modify

Do **not** modify:

- Dashboard implementation
- AI modules
- Question Bank
- Practice Mode
- Assessment modules
- Results
- Notifications

Only create the reusable application shell.

---

# 10. Frontend Tasks

Implement:

- Root layout
- Authenticated layout
- Public layout
- Sidebar
- Header
- Navigation menu
- Breadcrumbs
- Page container
- Responsive behavior
- Loading UI
- Error boundary
- 404 page

---

# 11. Backend Tasks

Minimal backend work only if required for:

- Navigation configuration
- User session integration
- Permission-aware navigation

Do not create business APIs.

---

# 12. Design Guidelines

The layout should be:

- Clean
- Minimal
- Responsive
- Accessible
- Consistent
- Easy to extend

Favor clarity over visual complexity.

---

# 13. AI Implementation Rules

The AI must:

- Reuse shared layout components.
- Avoid page-specific logic.
- Keep navigation data-driven where practical.
- Respect authentication and authorization.
- Follow the project's design conventions.

---

# 14. Implementation Checklist

- Global layout implemented
- Header created
- Sidebar created
- Responsive navigation works
- Protected layout configured
- Public layout configured
- Error boundary added
- Loading states implemented

---

# 15. Testing Checklist

Verify:

- Authenticated users see the application shell.
- Public pages use the correct layout.
- Navigation highlights the active page.
- Responsive behavior works across screen sizes.
- Unauthorized users cannot access protected layouts.
- Error boundary handles unexpected errors gracefully.

---

# 16. Acceptance Criteria

Task is complete when:

- All authenticated pages share a consistent layout.
- Navigation is responsive and accessible.
- Authentication integrates with the layout.
- No business-specific functionality is introduced.

---

# 17. Definition of Done

The application shell is complete when:

- Layout components are reusable.
- Navigation is operational.
- Responsive behavior is verified.
- Shared UI standards are established.
- Tests pass.

---

# 18. Deliverables

Expected outputs:

- Root layout
- Authenticated layout
- Public layout
- Header
- Sidebar
- Navigation components
- Error boundary
- Loading components
- Supporting tests

---

# 19. AI Execution Prompt

Read this task and all referenced documentation.

Implement only the shared application layout and navigation.

Do not begin Dashboard or any business modules.

Follow the project's coding standards, security checklist, and AI workflow.

Run all applicable validation and tests.

Provide a summary of changes, modified files, and testing results.

---

# 20. Next Task

Proceed to:

**006_DASHBOARD.md**
