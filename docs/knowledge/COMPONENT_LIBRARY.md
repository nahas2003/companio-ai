# COMPONENT_LIBRARY.md

> **Project:** Companio
> **Document Type:** Knowledge Base
> **Version:** 1.0
> **Status:** Living Document

---

# 1. Purpose

This document defines the reusable UI component library for Companio.

Its goals are to:

* Ensure a consistent user interface.
* Encourage component reuse.
* Reduce duplicate code.
* Improve maintainability.
* Guide AI coding agents toward existing components before creating new ones.

This document is the primary reference for all frontend development.

---

# 2. Design Philosophy

Components should be:

* Reusable
* Accessible
* Responsive
* Composable
* Theme-aware
* Easy to test
* Independent of business logic where practical

---

# 3. Component Organization

Organize reusable components using the following structure:

```text
src/
└── components/
    ├── ui/
    ├── forms/
    ├── layout/
    ├── navigation/
    ├── feedback/
    ├── data-display/
    ├── charts/
    ├── assessment/
    ├── ai/
    └── shared/
```

---

# 4. UI Components

## Button

Variants:

* Primary
* Secondary
* Outline
* Ghost
* Destructive
* Success
* Link

States:

* Default
* Hover
* Focus
* Active
* Loading
* Disabled

---

## Input

Support:

* Text
* Email
* Password
* Number
* Search
* URL
* File

Features:

* Validation
* Helper text
* Error message
* Icons
* Character counter

---

## Textarea

Features:

* Auto resize
* Character limit
* Validation
* Markdown support (optional)

---

## Select

Support:

* Single select
* Multi-select
* Searchable
* Async loading
* Clear option

---

## Checkbox

Support:

* Single
* Group
* Indeterminate

---

## Radio Group

Support:

* Horizontal
* Vertical

---

## Switch

Used for:

* Settings
* Feature toggles
* Preferences

---

## Badge

Variants:

* Default
* Success
* Warning
* Error
* Info

---

## Avatar

Support:

* Image
* Initials
* Placeholder

---

## Spinner

Use for:

* Loading states
* API calls
* AI generation

---

# 5. Layout Components

## App Layout

Contains:

* Header
* Sidebar
* Content area
* Footer (optional)

---

## Page Container

Provides:

* Standard page width
* Padding
* Responsive spacing

---

## Section

Reusable content block with:

* Title
* Description
* Actions

---

## Grid

Support:

* Responsive columns
* Gap utilities
* Auto layout

---

# 6. Navigation Components

* Sidebar
* Top Navigation
* Breadcrumbs
* Tabs
* Pagination
* Stepper
* Navigation Menu

---

# 7. Form Components

Reusable forms:

* Login Form
* Registration Form
* Profile Form
* Upload Form
* Assessment Form
* Settings Form

Shared utilities:

* Validation messages
* Error summary
* Form actions

---

# 8. Feedback Components

* Alert
* Toast
* Snackbar
* Confirmation Dialog
* Error Dialog
* Empty State
* Success State
* Loading State
* Skeleton Loader

---

# 9. Data Display Components

## Card

Variants:

* Statistic
* Information
* Dashboard
* AI Result
* Assessment
* User Profile

---

## Table

Features:

* Sorting
* Pagination
* Search
* Filters
* Row selection
* Responsive layout

---

## List

Support:

* Simple list
* Activity list
* Notification list

---

## Timeline

Used for:

* Activity history
* Processing status
* Assessment progress

---

# 10. Assessment Components

Reusable components:

* Question Card
* Question Navigator
* Answer Options
* Timer
* Progress Bar
* Score Summary
* Review Panel
* Results Breakdown

---

# 11. AI Components

Reusable components:

* AI Generation Status
* Prompt Preview
* AI Request Card
* AI Usage Indicator
* Generation Progress
* AI Provider Badge

---

# 12. Chart Components

Support:

* Bar Chart
* Line Chart
* Pie Chart
* Donut Chart
* Area Chart
* KPI Cards

Charts should consume standardized data structures.

---

# 13. Modal Components

Standard dialogs:

* Confirmation
* Delete
* Edit
* Create
* Preview
* Settings
* Error

Requirements:

* Keyboard accessible
* Focus management
* Escape key support

---

# 14. Accessibility Guidelines

All reusable components should:

* Support keyboard navigation.
* Include visible focus indicators.
* Use semantic HTML where appropriate.
* Provide ARIA attributes when necessary.
* Meet WCAG 2.1 AA standards where practical.

---

# 15. Styling Guidelines

Use:

* Shared design tokens
* Consistent spacing scale
* Typography scale
* Color palette
* Border radius
* Elevation/shadows

Avoid inline styles except where necessary.

---

# 16. Component Naming

Use PascalCase.

Examples:

* Button
* DataTable
* QuestionCard
* UploadDialog
* PracticeTimer
* UserAvatar

Component files should match component names.

---

# 17. AI Agent Guidelines

Before creating a new component, the AI agent should:

1. Search for an existing reusable component.
2. Extend an existing component if appropriate.
3. Avoid duplicating functionality.
4. Keep business logic outside shared UI components.
5. Document any newly introduced reusable component.
6. Update this library when adding shared components.

---

# 18. Testing Guidelines

Reusable components should include tests for:

* Rendering
* Props
* User interactions
* Accessibility
* Responsive behavior
* Error states

---

# 19. Maintenance

Update this document whenever:

* A reusable component is added.
* A component is deprecated.
* Naming conventions change.
* Design tokens evolve.
* New accessibility requirements are adopted.
