# Companio

> **AI-Powered Learning, Practice & Assessment Platform**

Companio is a modern, AI-assisted learning platform designed to transform study materials into interactive learning experiences. Users can upload learning resources, generate AI-powered questions, practice with personalized sessions, take assessments, and analyze their performance through detailed insights.

This project is being developed using a documentation-first approach with AI-assisted implementation, ensuring consistency, maintainability, and scalability.

---

# Vision

Build a secure, scalable, and AI-native learning platform that supports:

- AI-powered question generation
- Personalized practice sessions
- Online assessments
- Performance analytics
- Leaderboards
- Progress tracking
- Multi-platform access (Web, Mobile, Admin)

---

# Core Features

- User Authentication & Authorization
- Dashboard
- Learning Source Upload
- AI Processing Pipeline
- Question Bank
- Practice Mode
- Assessment Module
- Results & Analytics
- Leaderboards
- Notifications
- Administration & Settings

---

# Technology Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand (Client State)
- React Hook Form
- Zod

## Backend

- Supabase
- PostgreSQL
- Prisma (ORM)
- Supabase Authentication
- Supabase Storage
- Edge Functions (where appropriate)

## AI

- AI Orchestrator
- Configurable AI Providers
- Prompt Registry
- Structured Output Validation

## Mobile

- Expo
- React Native

## Development

- pnpm Workspaces
- ESLint
- Prettier
- Husky
- GitHub Actions (planned)

---

# Repository Structure

```text
companio/
├── apps/
├── packages/
├── docs/
│   ├── architecture/
│   ├── development/
│   ├── api/
│   └── tasks/
├── supabase/
├── scripts/
├── .github/
├── README.md
└── package.json
```

---

# Documentation

Project documentation is organized into dedicated areas:

- `docs/architecture/` – Product vision, architecture, modules, and technical decisions.
- `docs/development/` – Engineering standards, implementation guides, testing, deployment, security, and AI workflow.
- `docs/api/` – API specifications and contracts.
- `docs/tasks/` – Task-based implementation guides with acceptance criteria and testing checklists.

---

# Quick Start

## Prerequisites

- Node.js (LTS)
- pnpm
- Git
- Supabase account

## Installation

```bash
git clone <repository-url>
cd companio
pnpm install
```

## Environment Setup

1. Copy the environment template.

```bash
cp .env.example .env.local
```

2. Populate all required environment variables.

3. Configure the Supabase project.

4. Start the development server.

```bash
pnpm dev
```

---

# Development Workflow

1. Read the relevant architecture documentation.
2. Read the corresponding development guide.
3. Implement one module at a time.
4. Run validation and tests.
5. Update documentation if behavior changes.
6. Commit focused, reviewable changes.

---

# AI-Assisted Development

AI coding agents should follow the workflow defined in:

- `docs/development/24_AI_AGENT_WORKFLOW.md`

Before implementing any feature, review:

1. Master Project Specification
2. Project Constitution
3. Relevant Architecture Document
4. Relevant Development Guide
5. Coding Standards
6. Security Checklist

---

# Available Scripts

Examples (to be updated as the project evolves):

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
```

---

# Project Principles

- Documentation First
- Modular Architecture
- Secure by Default
- AI-Assisted Development
- Test Before Release
- Maintainable Code
- Incremental Delivery

---

# Project Status

Current phase:

- ✅ Architecture documentation
- ✅ Development documentation
- ⏳ Repository foundation
- ⏳ Project setup
- ⏳ Feature implementation

---

# Contributing

Please read:

- `CONTRIBUTING.md`

before opening issues or submitting pull requests.

---

# License

See the `LICENSE` file for licensing information.

---

# Roadmap

- Repository setup
- Authentication
- Dashboard
- Source Upload
- AI Processing
- Question Bank
- Practice Mode
- Assessment Module
- Results
- Leaderboards
- Notifications
- Mobile enhancements
- Production deployment

---

# Acknowledgements

Companio is designed as a documentation-driven, AI-assisted software project. The goal is to combine strong software engineering practices with modern AI tooling to produce a maintainable and scalable platform.

---

# Documentation Index

| Area                 | Purpose                                 |
| -------------------- | --------------------------------------- |
| `docs/architecture/` | Product architecture and specifications |
| `docs/development/`  | Engineering implementation guides       |
| `docs/api/`          | API contracts and references            |
| `docs/tasks/`        | Task-by-task implementation plans       |

For implementation details, always consult the relevant documentation before making code changes.
