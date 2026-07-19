# 01_PROJECT_SETUP.md

> **Project:** Companio
> **Document:** Project Setup Guide
> **Version:** 1.0
> **Status:** Active

---

# 1. Purpose

This document provides the complete procedure for creating the Companio project from scratch. It establishes the development environment, configures essential tools, and prepares the repository for feature implementation.

This guide should be followed only once when initializing a new project.

---

# 2. Objectives

After completing this guide:

* The project repository exists.
* The React application runs successfully.
* Development tooling is configured.
* Code quality tools are enabled.
* Supabase is connected.
* The folder structure is ready.
* Team members can clone and start development consistently.

---

# 3. Prerequisites

Required software:

* Git
* Node.js (LTS version)
* npm or pnpm
* Visual Studio Code (recommended)
* Supabase account
* GitHub account

Recommended VS Code extensions:

* ESLint
* Prettier
* Tailwind CSS IntelliSense
* Error Lens
* GitLens

---

# 4. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Routing

* React Router

## Data Fetching

* TanStack Query

## Backend

* Supabase

## Styling

* Tailwind CSS

## Forms

* React Hook Form
* Zod

## Icons

* Lucide React

## Notifications

* Sonner (or an equivalent toast library)

---

# 5. Repository Structure

Target structure:

```text
companio/
│
├── docs/
│   ├── architecture/
│   └── development/
│
├── public/
│
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── stores/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── .env.example
├── package.json
├── README.md
└── ...
```

---

# 6. Initial Project Creation

Tasks:

* Create the repository.
* Initialize a Vite React + TypeScript project.
* Install dependencies.
* Verify the application starts successfully.

Acceptance Criteria:

* Development server starts successfully.
* No TypeScript errors.
* Default application renders.

---

# 7. Dependency Installation

Install the core libraries required for development.

Categories include:

### Core

* React
* React DOM
* TypeScript

### Routing

* React Router

### State & Data

* TanStack Query

### Backend

* Supabase Client

### Validation

* Zod
* React Hook Form

### Styling

* Tailwind CSS

### Utilities

* clsx
* class-variance-authority

### UI

* Lucide React
* Sonner

---

# 8. Tailwind CSS Configuration

Tasks:

* Install Tailwind CSS.
* Configure content paths.
* Create global styles.
* Verify utility classes are working.

Acceptance Criteria:

* Tailwind classes render correctly.
* Global styles load successfully.

---

# 9. Code Quality Tools

Configure:

* ESLint
* Prettier

Recommended goals:

* Consistent formatting.
* Linting before commits.
* Automatic formatting in the editor.

Acceptance Criteria:

* Lint passes.
* Formatting is applied consistently.

---

# 10. Environment Configuration

Create:

* `.env.local`
* `.env.example`

Environment variables should include:

* Supabase URL
* Supabase Anon Key
* AI provider configuration (placeholder)
* Application metadata

Sensitive values must never be committed to source control.

---

# 11. Supabase Configuration

Tasks:

* Create a Supabase project.
* Connect the frontend.
* Verify database connectivity.
* Verify authentication client initialization.
* Verify storage connectivity.

Acceptance Criteria:

* Successful connection to Supabase.
* No authentication initialization errors.

---

# 12. Folder Organization

Create the base application folders before implementing features.

Guidelines:

* Keep feature code isolated.
* Separate reusable components.
* Separate business logic from UI.
* Group related functionality by feature.

---

# 13. Git Configuration

Recommended practices:

* Use a dedicated main branch.
* Develop features in feature branches.
* Write meaningful commit messages.
* Commit frequently with small, focused changes.

---

# 14. Initial Verification Checklist

Before moving to the next development phase, confirm:

* Project builds successfully.
* Development server starts.
* Type checking passes.
* Linting passes.
* Formatting is configured.
* Supabase connection works.
* Environment variables load correctly.
* Folder structure is complete.

---

# 15. Common Issues

Examples:

* Node.js version mismatch.
* Missing environment variables.
* Supabase connection failures.
* Tailwind configuration errors.
* Dependency version conflicts.

Document any project-specific resolutions as they arise.

---

# 16. Deliverables

At the end of this phase, the repository should contain:

* Configured React application.
* Development tooling.
* Folder structure.
* Connected Supabase client.
* Environment configuration.
* Documentation folders.
* Initial commit in version control.

---

# 17. Exit Criteria

Proceed to the next development phase only when:

* The application runs without errors.
* The development environment is reproducible.
* All developers can start the project successfully.
* The repository is ready for feature development.

---

# 18. Related Documents

## Depends On

* 00_MASTER_DEVELOPMENT_PLAN.md

## Architecture

* 02_SYSTEM_ARCHITECTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 21_PROJECT_CONSTITUTION.md

## Next Development Document

* 02_DATABASE_SETUP.md
