# Companio AI

> **AI-Powered Learning, Practice & Assessment Platform**

Companio is a modern, AI-assisted learning platform designed to transform study materials into interactive study decks. Users can upload learning resources, generate AI-powered questions, study with timed practice playroom sessions, take proctored assessments, and analyze their grading performance through detailed insights.

This project is built using a documentation-first approach with robust monorepo structures, ensuring consistency, security, and scalability.

---

## 1. Project Overview

Companio serves as the operational bridge between raw source files (PDFs, DOCX, TXT notes) and interactive learning. Its modular architecture handles file processing, AI orchestration pipelines, custom practice drawers, multi-user exam rooms, in-app notification centers, and full administrative configuration panels under unified role-based authorization parameters.

---

## 2. Core Features

- **Authentication & Lazy Provisioning:** Secure email/password login integrated with Supabase Client SDK auth, featuring lazy database user model synchronization.
- **Metrics Dashboard:** Real-time analytics aggregate charts tracking study accuracy averages, questions answered, and feeds of study streams.
- **Material Catalog Ingestion:** S3-like Supabase storage file stream uploads with size constraints (10MB) and extraction engines (PDF parsing, DOCX text extraction).
- **AI Orchestrator Pipeline:** Dual providers adapter routing (Google Gemini API vs Mock Sandbox Loopback) featuring request timeouts, retry policies, and structured JSON output validation.
- **Interactive Question Bank:** Paginated repositories of generated questions supporting searches, filter, inline editing, and bulk deletion transactions.
- **Timed Practice Playroom:** Slide deck playroom displaying timed sheets, session resume options (force-start vs continue previous), and scoring analysis.
- **Proctored Assessments:** Instructor templates creation, unique 6-digit invitation access keys generation, guest taking exams with startedAt timer security.
- **Notification Bell Center:** Real-time bell dropdown alerts, total unread badge counts, mark-read, delete, and email log preferences controls.
- **System Administration Workspace:** Tabs console for user management (change role, toggle active/deactivate), system preferences, AI provider model defaults, storage limits, and transactional audit trails table.

---

## 3. Architecture & Tech Stack

Companio utilizes a workspace monorepo architecture separating the applications layer from shared utility modules:

```text
companio/
├── apps/
│   └── web/                # Next.js 14.2 (App Router client application)
├── packages/
│   ├── db/                 # Prisma ORM schemas, database clients
│   ├── ui/                 # Reusable React tailwind components
│   └── tsconfig/           # Monorepo shared tsconfig presets
├── docs/                   # Architectural guides, checklists, reports
└── package.json            # Monorepo configuration
```

### Technology Stack

- **Frontend / Core:** React 18, Next.js 14.2, TypeScript, Zustand (Client State), React Hook Form, Zod.
- **Styling:** Tailwind CSS, shadcn/ui.
- **Backend / DB:** Supabase Client, PostgreSQL, Prisma (ORM).
- **AI Integration:** Google Gemini Generative AI SDK, Custom Mock Adaptor.

---

## 4. Installation

Ensure you have [Node.js (LTS)](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed.

```bash
# Clone the repository
git clone https://github.com/nahas2003/companio-ai.git
cd companio-ai

# Install workspaces dependencies
pnpm install
```

---

## 5. Environment Variables Configuration

Copy the environment template in both the root directory and the `apps/web/` folder:

```bash
cp .env.example .env
cp .env.example apps/web/.env.local
```

Populate the variables:

| Variable                        | Description                      | Example Value                      |
| :------------------------------ | :------------------------------- | :--------------------------------- |
| `DATABASE_URL`                  | PostgreSQL connection pooler URI | `postgresql://postgres:...`        |
| `DIRECT_URL`                    | PostgreSQL direct connection URI | `postgresql://postgres:...`        |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project endpoint        | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key         | `eyJhbGciOiJIUzI1NiIsIn...`        |
| `GEMINI_API_KEY`                | Google Gemini developer token    | `AIzaSy...`                        |

---

## 6. Database Setup

Synchronize the database schemas with your remote Supabase instance:

```bash
# Push schema updates and generate Prisma Client
pnpm --filter db exec prisma db push
```

---

## 7. AI Provider Configuration

By default, the application runs on the Google Gemini SDK adapter. You can configure:

- **Active Adapter:** Google Gemini API vs Mock adapter.
- **Default model:** `gemini-1.5-pro` / `gemini-1.5-flash`.
- **Generation Settings:** Configured globally inside the **Admin Workspace** AI config panel or customized inside `.env` variables.

---

## 8. Running Locally

Start the local development server:

```bash
# Runs dev server in workspaces
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) on your browser.

---

## 9. Deployment

To deploy the Next.js web application to Vercel:

1. Link your GitHub repository to Vercel.
2. In the project build parameters, set:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `apps/web`
3. Add all your environment variables in Vercel project configuration.
4. Set the build command overrides to compile dependencies:
   - **Build Command:** `cd ../.. && pnpm build`

---

## 10. Screenshots

_Desktop view of the polished SaaS Landing Page:_
![Polished Landing Page](https://raw.githubusercontent.com/nahas2003/companio-ai/main/docs/assets/landing_preview.png)

---

## 11. Future Roadmap

- [ ] Mobile application integration via Expo React Native.
- [ ] White-label platform customization templates for institutions.
- [ ] Web Application Firewall (WAF) rate limiters.
- [ ] Automated end-to-end browser regression testing suites.

---

## 12. License

This project is licensed under the MIT License. See [`LICENSE`](file:///c:/Users/muham/Desktop/Network%20System%20projects/Companio%20Ai/LICENSE) for details.
