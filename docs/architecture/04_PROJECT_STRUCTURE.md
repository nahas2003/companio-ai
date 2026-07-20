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

- UI
- Components
- Pages
- Hooks
- Services
- Types
- Validation
- Tests

Shared functionality belongs in shared folders.

---

# 3. Root Structure

```text
companio/
├── apps/                  <-- Application projects
│   └── web/               <-- Next.js frontend web app
├── packages/              <-- Shared workspace packages
│   ├── db/                <-- Prisma ORM package
│   ├── ui/                <-- Shared component library
│   ├── tsconfig/          <-- Shared TypeScript configurations
│   └── eslint-config/     <-- Shared ESLint configurations
├── docs/                  <-- Technical documentation
├── supabase/              <-- Supabase config, migrations, seed, functions
├── scripts/               <-- Helper scripts
├── pnpm-workspace.yaml    <-- Monorepo workspaces definition
├── package.json           <-- Root package config
├── tsconfig.json          <-- Root TS config
├── eslint.config.js       <-- Root ESLint config
├── prettier.config.js     <-- Root Prettier config
├── README.md              <-- Project README
└── .env.example           <-- Environment template
```

---

# 4. Web Application Structure (`apps/web`)

```text
apps/web/
├── app/                   <-- Next.js App Router (pages/layouts/routing)
├── features/              <-- Business features (practice, assessment, auth, etc.)
│   └── [feature_name]/
│       ├── components/    <-- Feature-specific components
│       ├── hooks/         <-- Feature-specific hooks
│       ├── services/      <-- Feature-specific business services
│       ├── types/         <-- Feature-specific types
│       └── utils/         <-- Feature-specific utilities
├── components/            <-- Web app reusable UI components (from packages/ui wrapper)
├── hooks/                 <-- Web app shared React hooks
├── lib/                   <-- Web app wrappers/initializations (e.g., supabase.ts client)
├── services/              <-- Web app shared business services
├── styles/                <-- Global styling (globals.css containing Tailwind directives)
├── types/                 <-- Web app shared TypeScript types
└── utils/                 <-- Web app shared pure utility functions
```

---

# 5. Shared Packages Structure (`packages/`)

## db/

Contains Prisma ORM configuration, schema, database client, and migrations:

- `prisma/schema.prisma` - Database schema definition.
- `src/index.ts` - Exports a PrismaClient singleton.
- `package.json` - Declares `@prisma/client` and custom Prisma scripts.

## ui/

Contains shared UI components and design tokens (built on shadcn/ui and Tailwind):

- `src/components/` - Button, Card, Modal, Input, Dialog, etc.
- `package.json` - Tailwind config and UI dependencies.

## tsconfig/

Contains base TypeScript config files extended by projects in the workspace:

- `base.json` - Base options.
- `nextjs.json` - Next.js-specific options.
- `react-library.json` - React component library options.

## eslint-config/

Shared ESLint configs for consistency across packages and apps.

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

- lowercase
- kebab-case

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

- Have one responsibility.
- Be reusable when practical.
- Avoid unnecessary props.
- Avoid hidden side effects.

Split components when they become difficult to understand.

---

# 10. Service Rules

Services should:

- Be stateless.
- Handle business logic.
- Communicate with APIs.
- Never render UI.

---

# 11. Hook Rules

Hooks should:

- Encapsulate reusable logic.
- Never return JSX.
- Keep side effects isolated.

---

# 12. Utility Rules

Utilities should:

- Be pure functions.
- Avoid external state.
- Be independently testable.

---

# 13. File Size Guidelines

Recommended limits:

- Component: ≤ 250 lines
- Service: ≤ 300 lines
- Hook: ≤ 150 lines
- Utility: ≤ 150 lines

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

- Utility importing React
- Shared components importing feature code
- Circular dependencies

---

# 15. Reusability Rules

Before creating:

- Component
- Hook
- Service
- Utility

Search the existing project first.

Do not duplicate functionality.

---

# 16. AI Implementation Rules

Every AI agent must:

- Place files in the correct folder.
- Reuse existing code before creating new files.
- Avoid creating duplicate utilities.
- Avoid duplicate services.
- Preserve folder consistency.
- Keep public APIs stable unless requirements change.

---

# 17. Validation Checklist

Before completing implementation:

- Correct folder placement.
- Naming conventions followed.
- No duplicate code.
- No circular dependencies.
- Build succeeds.
- Type check succeeds.
- Lint succeeds.
- Imports are clean.
- Project structure remains consistent.

---

# 18. Dependencies

Depends on:

- 00_PROJECT_OVERVIEW.md
- 01_PRODUCT_REQUIREMENTS.md
- 02_SYSTEM_ARCHITECTURE.md
- 03_TECH_STACK.md

Referenced by:

- 05_DATABASE_ARCHITECTURE.md
- 06_API_SPECIFICATION.md
- All feature documents.
