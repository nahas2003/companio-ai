# 03_TECH_STACK.md

> **Project:** Companio
>
> **Document:** Technology Stack
>
> **Version:** 1.0 (MVP)
>
> **Status:** Draft
>
> **Priority:** Critical
>
> **Depends On:** 00_PROJECT_OVERVIEW.md, 01_PRODUCT_REQUIREMENTS.md, 02_SYSTEM_ARCHITECTURE.md

---

# 1. Purpose

This document defines the approved technologies, libraries, development tools, coding standards, and architectural decisions for Companio.

Only the technologies defined here should be used unless explicitly approved in a future revision.

---

# 2. Design Principles

Every technology must satisfy the following goals:

* Simple
* Maintainable
* Secure
* Scalable
* Cost Effective
* Beginner Friendly
* AI Friendly
* Community Supported

---

# 3. Frontend Stack

## Framework

React

Reason

* Large ecosystem
* Component architecture
* Excellent TypeScript support
* Easy future expansion

---

## Language

TypeScript

Reason

* Type safety
* Better AI-generated code
* Easier refactoring
* Better developer experience

Strict mode must always remain enabled.

---

## Build Tool

Vite

Reason

* Fast development
* Fast build
* Simple configuration
* Excellent React integration

---

## Styling

Tailwind CSS

Reason

* Reusable UI
* Fast development
* Responsive by default
* Minimal CSS maintenance

Avoid writing custom CSS unless absolutely necessary.

---

## Icons

Lucide React

Reason

* Lightweight
* Consistent
* Tree-shakable

---

## Forms

React Hook Form

Reason

* High performance
* Easy validation
* Small bundle size

---

## Validation

Zod

Reason

* Runtime validation
* Type-safe schemas
* Shared validation logic

---

## Routing

React Router

Reason

* Mature ecosystem
* Simple API
* Flexible nested routing

---

## Tables

TanStack Table

Reason

* Powerful
* Flexible
* Highly customizable

---

## State Management

React Context

Use for:

* Authentication
* Theme
* Global application state

Do not introduce additional state management libraries unless required by future complexity.

---

## Server State

TanStack Query

Use for:

* API requests
* Caching
* Loading states
* Background refetching

---

# 4. Backend Stack

Backend Platform

Supabase

Reason

* PostgreSQL
* Authentication
* Storage
* Row Level Security
* Realtime capabilities
* Edge Functions
* Cost effective

---

## Database

PostgreSQL

Reason

* Relational
* Reliable
* Scalable
* Strong SQL support

---

## Storage

Supabase Storage

Used for

* PDF uploads
* User assets
* Assessment resources

---

## Authentication

Supabase Auth

Supports

* Email login
* Google login (future)

Participants may continue as guests without authentication.

---

## Edge Functions

Used for

* AI requests
* Secure server logic
* API orchestration

Never expose AI API keys to the frontend.

---

# 5. AI Stack

Provider Abstraction Layer

The frontend must never communicate directly with an AI provider.

Preferred provider order:

1. Gemini
2. Groq
3. NVIDIA Build
4. OpenAI (Future)
5. Claude (Future)
6. Ollama (Future)

Every provider must return the same JSON structure.

---

# 6. Development Tools

Package Manager

npm

Code Editor

VS Code

Recommended Extensions

* ESLint
* Prettier
* Tailwind CSS IntelliSense
* Error Lens
* GitLens

---

# 7. Code Quality Tools

Formatting

Prettier

Linting

ESLint

Type Checking

TypeScript Compiler

Every pull request or AI-generated feature should pass:

* Build
* Lint
* Type check

before completion.

---

# 8. Environment Variables

Sensitive values must never be hardcoded.

Examples:

* Supabase URL
* Supabase Key
* AI API Keys
* Storage Keys

Environment variables should be validated at startup.

---

# 9. Approved Libraries

Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* React Hook Form
* Zod
* TanStack Query
* TanStack Table
* Lucide React

Backend

* Supabase
* PostgreSQL

Development

* ESLint
* Prettier

---

# 10. Restricted Libraries

Do not introduce libraries without clear justification.

Avoid:

* Multiple UI frameworks
* Multiple state management libraries
* Duplicate validation libraries
* Large utility libraries when native APIs are sufficient

Keep dependencies minimal.

---

# 11. Versioning Strategy

* Pin major versions.
* Review dependency updates before upgrading.
* Avoid automatic major-version upgrades.

---

# 12. Performance Guidelines

* Lazy load routes where appropriate.
* Optimize images and PDFs.
* Minimize bundle size.
* Cache AI responses.
* Avoid unnecessary re-renders.

---

# 13. Security Guidelines

* Never expose secrets.
* Validate all user input.
* Validate uploaded files.
* Use HTTPS.
* Enable Row Level Security.
* Restrict storage access.
* Sanitize AI outputs before use.

---

# 14. AI Coding Rules

AI agents must:

* Use only approved libraries.
* Follow project structure.
* Prefer reusable components.
* Keep functions small and focused.
* Avoid duplicated logic.
* Add comments only when they improve clarity.
* Preserve backward compatibility unless requirements change.

---

# 15. Validation Checklist

Before considering a feature complete:

* Project builds successfully.
* No TypeScript errors.
* No ESLint errors.
* Approved libraries only.
* No hardcoded secrets.
* No unnecessary dependencies.
* Documentation updated if stack changes.

---

# 16. Dependencies

Depends on:

* 00_PROJECT_OVERVIEW.md
* 01_PRODUCT_REQUIREMENTS.md
* 02_SYSTEM_ARCHITECTURE.md

Referenced by:

* 04_PROJECT_STRUCTURE.md
* 05_DATABASE_ARCHITECTURE.md
* 06_API_SPECIFICATION.md
* All implementation documents.
