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

- Simple
- Maintainable
- Secure
- Scalable
- Cost Effective
- Beginner Friendly
- AI Friendly
- Community Supported

---

# 3. Frontend Stack

## Framework

Next.js (App Router)

Reason

- Hybrid Static & Server Rendering
- File-system based Routing
- Built-in API optimization
- Strong React Server Components support
- Seamless deployment on Vercel

---

## Language

TypeScript

Reason

- Type safety
- Better AI-generated code
- Easier refactoring
- Better developer experience

Strict mode must always remain enabled.

---

## Build Tool & Bundler

Next.js Compiler (Turbopack / Webpack)

Reason

- Sub-second hot module reloading (Turbopack)
- Optimized production bundles automatically
- Built-in support for Tailwind CSS and TypeScript
- Better developer experience

Strict mode must always remain enabled.

---

## Styling

Tailwind CSS

Reason

- Reusable UI
- Fast development
- Responsive by default
- Minimal CSS maintenance

Avoid writing custom CSS unless absolutely necessary.

---

## Icons

Lucide React

Reason

- Lightweight
- Consistent
- Tree-shakable

---

## Forms

React Hook Form

Reason

- High performance
- Easy validation
- Small bundle size

---

## Validation

Zod

Reason

- Runtime validation
- Type-safe schemas
- Shared validation logic

---

## Routing

Next.js App Router (File-system based)

Reason

- Native support for layouts, nesting, and loading states
- Server-side routing with automatic code splitting
- High performance and SEO friendly

---

## Tables

TanStack Table

Reason

- Powerful
- Flexible
- Highly customizable

---

## State Management

Zustand & React Context

Use for:

- Zustand: Lightweight, hook-based client-side state management.
- React Context: Theme configurations and provider contexts.

---

## Server State

TanStack Query

Use for:

- API requests
- Caching
- Loading states
- Background refetching

---

# 4. Backend Stack

Backend Platform

Supabase

Reason

- PostgreSQL
- Authentication
- Storage
- Row Level Security
- Realtime capabilities
- Edge Functions
- Cost effective

---

## Database & ORM

PostgreSQL & Prisma

Reason

- Relational, reliable, and highly scalable database (hosted on Supabase)
- Prisma provides type-safe query building, auto-completion, and database migrations

---

## Storage

Supabase Storage

Used for

- PDF uploads
- User assets
- Assessment resources

---

## Authentication

Supabase Auth

Supports

- Email login
- Google login (future)

Participants may continue as guests without authentication.

---

## Edge Functions

Used for

- AI requests
- Secure server logic
- API orchestration

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

pnpm

Code Editor

VS Code

Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- GitLens

---

# 7. Code Quality Tools

Formatting

Prettier

Linting

ESLint

Type Checking

TypeScript Compiler

Every pull request or AI-generated feature should pass:

- Build
- Lint
- Type check

before completion.

---

# 8. Environment Variables

Sensitive values must never be hardcoded.

Examples:

- Supabase URL
- Supabase Key
- AI API Keys
- Storage Keys

Environment variables should be validated at startup.

---

# 9. Approved Libraries

Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query (server state)
- Zustand (client state)
- TanStack Table
- Lucide React

Backend

- Supabase
- Prisma ORM
- PostgreSQL

Development

- pnpm (Workspace management)
- ESLint
- Prettier
- Prisma CLI

---

# 10. Restricted Libraries

Do not introduce libraries without clear justification.

Avoid:

- Multiple UI frameworks
- Multiple state management libraries
- Duplicate validation libraries
- Large utility libraries when native APIs are sufficient

Keep dependencies minimal.

---

# 11. Versioning Strategy

- Pin major versions.
- Review dependency updates before upgrading.
- Avoid automatic major-version upgrades.

---

# 12. Performance Guidelines

- Lazy load routes where appropriate.
- Optimize images and PDFs.
- Minimize bundle size.
- Cache AI responses.
- Avoid unnecessary re-renders.

---

# 13. Security Guidelines

- Never expose secrets.
- Validate all user input.
- Validate uploaded files.
- Use HTTPS.
- Enable Row Level Security.
- Restrict storage access.
- Sanitize AI outputs before use.

---

# 14. AI Coding Rules

AI agents must:

- Use only approved libraries.
- Follow project structure.
- Prefer reusable components.
- Keep functions small and focused.
- Avoid duplicated logic.
- Add comments only when they improve clarity.
- Preserve backward compatibility unless requirements change.

---

# 15. Validation Checklist

Before considering a feature complete:

- Project builds successfully.
- No TypeScript errors.
- No ESLint errors.
- Approved libraries only.
- No hardcoded secrets.
- No unnecessary dependencies.
- Documentation updated if stack changes.

---

# 16. Dependencies

Depends on:

- 00_PROJECT_OVERVIEW.md
- 01_PRODUCT_REQUIREMENTS.md
- 02_SYSTEM_ARCHITECTURE.md

Referenced by:

- 04_PROJECT_STRUCTURE.md
- 05_DATABASE_ARCHITECTURE.md
- 06_API_SPECIFICATION.md
- All implementation documents.
