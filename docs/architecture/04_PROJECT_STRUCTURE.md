# 04_PROJECT_STRUCTURE.md

> **Project:** Companio
>
> **Document:** Project Structure
>
> **Version:** 1.0 (MVP)
>
> **Status:** Draft
>
> **Priority:** Critical
>
> **Depends On:** 00_PROJECT_OVERVIEW.md, 01_PRODUCT_REQUIREMENTS.md, 02_SYSTEM_ARCHITECTURE.md, 03_TECH_STACK.md

---

# 1. Purpose

This document defines the official folder structure, file organization, naming conventions, and ownership rules for the Companio codebase.

Every developer and AI agent must follow this structure.

No feature should create a new folder unless there is a documented architectural reason.

---

# 2. Architecture Style

Companio uses a **Feature-Based Architecture**.

Each feature owns:

* UI
* Components
* Pages
* Hooks
* Services
* Types
* Validation
* Tests

Shared functionality belongs in shared folders.

---

# 3. Root Structure

```text
companio/

├── docs/
├── public/
├── src/
├── supabase/
├── scripts/
├── tests/
├── .github/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── .env.example
```

---

# 4. Source Structure

```text
src/

├── app/
├── assets/
├── components/
├── features/
├── hooks/
├── lib/
├── providers/
├── services/
├── types/
├── utils/
├── constants/
├── styles/
└── main.tsx
```

---

# 5. Folder Responsibilities

## app/

Contains:

* Routing
* Route guards
* Layouts
* Global application initialization

Must NOT contain business logic.

---

## assets/

Contains:

* Images
* Icons
* Fonts
* Static files

---

## components/

Contains only reusable UI components.

Examples:

* Button
* Card
* Modal
* Input
* Dialog
* Loader
* Empty State

Must never contain feature-specific business logic.

---

## features/

Contains business features.

Example:

```text
features/

practice/

assessment/

leaderboard/

authentication/

results/
```

Each feature is self-contained.

---

## hooks/

Reusable React hooks only.

Example:

```text
useDebounce

useTimer

useCountdown

useNetworkStatus
```

---

## lib/

Contains wrappers and integrations.

Example:

* Supabase client
* AI client
* Logger
* Configuration

---

## providers/

Application providers.

Example:

* AuthProvider
* ThemeProvider
* QueryProvider

---

## services/

Shared services.

Example:

* API Service
* Cache Service
* File Service
* Validation Service

Business logic shared across multiple features belongs here.

---

## types/

Shared TypeScript types.

Never duplicate interfaces.

---

## utils/

Pure utility functions.

Examples:

* Date formatting
* String helpers
* Hashing
* Random generators

Utilities must never depend on React.

---

## constants/

Application constants.

Examples:

* Limits
* Default values
* Supported file types
* Assessment settings

---

## styles/

Global styles only.

Tailwind should remain the primary styling solution.

---

# 6. Feature Structure

Each feature follows the same structure.

Example:

```text
features/

practice/

components/

pages/

hooks/

services/

schemas/

types/

utils/

index.ts
```

This consistency makes the project easy to navigate.

---

# 7. Naming Conventions

Folders

* lowercase
* kebab-case

Example

```text
question-bank
```

---

Files

Components

```text
QuestionCard.tsx
```

Hooks

```text
useTimer.ts
```

Services

```text
assessment.service.ts
```

Utilities

```text
date.utils.ts
```

Types

```text
assessment.types.ts
```

Validation

```text
assessment.schema.ts
```

---

# 8. Import Rules

Preferred order:

1. React
2. External libraries
3. Shared modules
4. Feature modules
5. Relative imports

Avoid deeply nested relative imports.

Prefer path aliases where appropriate.

---

# 9. Component Rules

Each component should:

* Have one responsibility.
* Be reusable when practical.
* Avoid unnecessary props.
* Avoid hidden side effects.

Split components when they become difficult to understand.

---

# 10. Service Rules

Services should:

* Be stateless.
* Handle business logic.
* Communicate with APIs.
* Never render UI.

---

# 11. Hook Rules

Hooks should:

* Encapsulate reusable logic.
* Never return JSX.
* Keep side effects isolated.

---

# 12. Utility Rules

Utilities should:

* Be pure functions.
* Avoid external state.
* Be independently testable.

---

# 13. File Size Guidelines

Recommended limits:

* Component: ≤ 250 lines
* Service: ≤ 300 lines
* Hook: ≤ 150 lines
* Utility: ≤ 150 lines

If a file grows significantly beyond these guidelines, consider refactoring.

---

# 14. Dependency Rules

Allowed direction:

```text
Page

↓

Feature

↓

Service

↓

Library

↓

Database/API
```

Not allowed:

* Utility importing React
* Shared components importing feature code
* Circular dependencies

---

# 15. Reusability Rules

Before creating:

* Component
* Hook
* Service
* Utility

Search the existing project first.

Do not duplicate functionality.

---

# 16. AI Implementation Rules

Every AI agent must:

* Place files in the correct folder.
* Reuse existing code before creating new files.
* Avoid creating duplicate utilities.
* Avoid duplicate services.
* Preserve folder consistency.
* Keep public APIs stable unless requirements change.

---

# 17. Validation Checklist

Before completing implementation:

* Correct folder placement.
* Naming conventions followed.
* No duplicate code.
* No circular dependencies.
* Build succeeds.
* Type check succeeds.
* Lint succeeds.
* Imports are clean.
* Project structure remains consistent.

---

# 18. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md
* 03_TECH_STACK.md

Referenced by:

* 05_DATABASE_ARCHITECTURE.md
* 06_API_SPECIFICATION.md
* All feature documents.
